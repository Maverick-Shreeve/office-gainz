import { supabaseAdmin } from "../../utils/supabaseClient";
import moment from "moment";

export default async function handler(req, res) {
  const { filter = "all" } = req.query;
  let startDate;

  if (filter === "week") {
    startDate = moment().subtract(7, "days").toISOString();
  } else if (filter === "month") {
    startDate = moment().subtract(1, "month").toISOString();
  }

  try {
    let query = supabaseAdmin.from("exercises").select("*");
    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    const { data: exerciseData, error: exerciseError } = await query;

    if (exerciseError) {
      return res.status(500).json({ error: "Error fetching exercises" });
    }

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      return res.status(500).json({ error: "Error fetching user profiles" });
    }

    const userResults = {};

    exerciseData.forEach((record) => {
      if (!userResults[record.user_id]) {
        const user = userData.users.find((u) => u.id === record.user_id);
        const fullName = user?.user_metadata?.full_name || "Unknown";
        const displayName = fullName.match(/\(([^)]+)\)/)?.[1] || fullName;

        userResults[record.user_id] = {
          id: record.user_id,
          displayName,
          total_reps: 0,
          total_duration: 0,
          sets: 0,
        };
      }
      userResults[record.user_id].total_reps += Number(record.count);
      userResults[record.user_id].total_duration += Number(
        record.duration || 0
      );
      userResults[record.user_id].sets += 1;
    });

    const leaderboardArray = Object.values(userResults).sort(
      (a, b) => b.total_reps - a.total_reps
    );

    res.status(200).json(leaderboardArray);
  } catch (error) {
    res.status(500).json({ error: "Unexpected error" });
  }
}
