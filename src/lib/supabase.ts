import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GameRow = {
  id: string;
  code: string;
  board: (string | null)[];
  x_moves: number[];
  o_moves: number[];
  current_player: "X" | "O";
  status: "waiting" | "playing" | "won" | "draw";
  winner: "X" | "O" | null;
  x_score: number;
  o_score: number;
  created_at: string;
};
