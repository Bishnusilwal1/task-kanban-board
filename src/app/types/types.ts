export interface Card {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}
