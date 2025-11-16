import { DateHelper } from "./date.helper";

describe("Date Helper", () => {
  it("should format date", () => {
    expect(DateHelper.formatDate(new Date("1970-01-01"))).toEqual("1970-01-01");
  });
});
