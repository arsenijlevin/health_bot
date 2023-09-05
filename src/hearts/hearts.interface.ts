export default interface IHeartsService {
  resetHeartState: () => void;
  removeHearts: (count: number) => void;
  restoreHearts: (count: number) => void;
  getHeartImagePath: () => string;
}
