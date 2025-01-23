import { render, act } from "@testing-library/react";

import "@testing-library/jest-dom";
import { useLocalStorage } from "@/app/utils/localStorageUtils";

// Mocking localStorage
beforeEach(() => {
  // Mock the localStorage methods
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(jest.fn());
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(jest.fn());
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("useLocalStorage", () => {
  it("should return the initial value when no value is in localStorage", () => {
    const TestComponent = () => {
      const [value] = useLocalStorage("test-key", "default");
      return <div>{value}</div>;
    };

    const { getByText } = render(<TestComponent />);

    // Ensure the initial value is rendered
    expect(getByText("default")).toBeInTheDocument();
  });

  it("should return the stored value if it exists in localStorage", () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify("stored-value")
    );

    const TestComponent = () => {
      const [value] = useLocalStorage("test-key", "default");
      return <div>{value}</div>;
    };

    const { getByText } = render(<TestComponent />);

    // Ensure the value from localStorage is rendered
    expect(getByText("stored-value")).toBeInTheDocument();
  });

  it("should update the state and localStorage when the set function is called", () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify("stored-value")
    );

    const TestComponent = () => {
      const [value, setValue] = useLocalStorage("test-key", "default");

      return (
        <div>
          <div>{value}</div>
          <button onClick={() => setValue("new-value")}>Update</button>
        </div>
      );
    };

    const { getByText } = render(<TestComponent />);

    // Initially, the value from localStorage should be displayed
    expect(getByText("stored-value")).toBeInTheDocument();

    // Click the update button to change the value
    act(() => {
      getByText("Update").click();
    });

    // Ensure the localStorage setItem was called with the new value
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("new-value")
    );

    // Check if the updated value is displayed
    expect(getByText("new-value")).toBeInTheDocument();
  });
});
