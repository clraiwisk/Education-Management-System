enum Occupy { idle = 0, use = 1 }

interface roomModel {
  readonly clsr_id: number;
  clsr_name: string;
  clsr_occupy: Occupy;
}