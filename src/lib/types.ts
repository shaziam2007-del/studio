export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: "work" | "personal" | "study" | "other";
  completed?: boolean;
};

export type View = "day" | "week" | "month";
