import * as React from "react";

function MainComponent() {
  const [selectedDishes, setSelectedDishes] = React.useState([]);
  const [currentStep, setCurrentStep] = React.useState("choose");
  const dishes = [
    {
      name: "Pho",
      price: 35000,
      description:
        "Harmonious harmony combination of many traditional and healthy ingredients",
    },
    {
      name: "Braised Meat Rice",
      price: 30000,
      description:
        "Braised pork is a familiar dish on the Vietnamese dinner table. The dish carries with it many cultural beauties of the country and people",
    },
    {
      name: "Nam Vang Noodles",
      price: 35000,
      description:
        "The main ingredients of noodles are noodles, the main broth is with minced meat and pork intestines cooked together.",
    },
    { name: "Apple", price: 7000, description: "Freshly picked" },
    {
      name: "Soft Drinks",
      price: 10000,
      description: "Coca-cola, Pepsi, Sprite, Fanta, Sting, 7-up",
    },
    {
      name: "Beef Rice Noodles",
      price: 35000,
      description:
        "Beef rice noodle soup's main ingredients are vermicelli, beef shank, pork sausage, pork sausage, boiled blood and a characteristic red broth.",
    },
    {
      name: "Com Tam",
      price: 30000,
      description:
        "A typical dish of the Southern Vietnam region, considered a traditional and popular dish",
    },
    {
      name: "Braised Fish Rice",
      price: 30000,
      description: "Braised fish is a familiar dish of Western Vietnam people",
    },
    { name: "Pineapple", price: 8000, description: "Sweet and juicy" },
  ];
  function toggleDish(dishName) {
    if (selectedDishes.includes(dishName)) {
      setSelectedDishes(selectedDishes.filter((dish) => dish !== dishName));
    } else {
      setSelectedDishes([...selectedDishes, dishName]);
    }
  }
  function calculateTotal() {
    return selectedDishes.reduce((total, dishName) => {
      return total + dishes.find((dish) => dish.name === dishName).price;
    }, 0);
  }
  function downloadReceipt() {
    const total = calculateTotal();
    const receiptText =
      `Receipt for Cơm Việt:\n\n` +
      selectedDishes
        .map(
          (dishName) =>
            `- ${dishName}: ${
              dishes.find((dish) => dish.name === dishName).price
            } VND`
        )
        .join("\n") +
      `\n\nTotal: ${total} VND`;
    const element = document.createElement("a");
    const file = new Blob([receiptText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "ComViet_Receipt.txt";
    document.body.appendChild(element);
    element.click();
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAF3E0]">
      {currentStep === "choose" && (
        <>
          <h1 className="text-4xl font-bold text-[#6D4C41] mb-8 font-crimson-text">
            Cơm Việt - HCMIU Food Booth
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {dishes.map((dish, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  selectedDishes.includes(dish.name)
                    ? "ring-4 ring-[#6D4C41] ring-opacity-50"
                    : "bg-white"
                } shadow-xl p-6 rounded-lg`}
              >
                <img
                  src={`/dishes/${dish.name
                    .toLowerCase()
                    .replace(/ /g, "-")}.jpg`}
                  alt={`${dish.name} at Cơm Việt`}
                  className="w-64 h-64 object-cover rounded-md mb-4"
                />
                <h2 className="text-2xl font-semibold mb-2 text-[#6D4C41] font-roboto">
                  {dish.name}
                </h2>
                <p className="text-md mb-1 font-roboto">{dish.description}</p>
                <p className="text-md font-roboto">
                  {dish.price.toLocaleString("en")} VND
                </p>
                <button
                  onClick={() => toggleDish(dish.name)}
                  className="bg-[#6D4C41] text-white font-bold py-2 px-4 rounded-lg mt-4 hover:bg-[#5e4233] transition duration-200 font-roboto"
                >
                  Choose
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentStep("review")}
            className="border-2 border-[#6D4C41] text-[#6D4C41] font-bold py-2 px-4 rounded-lg mb-4 hover:bg-[#6D4C41] hover:text-white transition duration-200 font-roboto"
          >
            Review Shopping Cart
          </button>
        </>
      )}
      {currentStep === "review" && (
        <>
          <h2 className="text-3xl font-bold text-[#6D4C41] mb-6 font-crimson-text">
            Shopping Cart
          </h2>
          <ul className="mb-4">
            {selectedDishes.map((dishName) => (
              <li
                key={dishName}
                className="border-b-2 border-[#6D4C41] py-2 font-roboto"
              >
                {dishName} -{" "}
                {dishes
                  .find((dish) => dish.name === dishName)
                  .price.toLocaleString("en")}{" "}
                VND
              </li>
            ))}
          </ul>
          <p className="font-bold text-[#6D4C41] mb-6 font-roboto">
            Total: {calculateTotal().toLocaleString("en")} VND
          </p>
          <button
            onClick={() => setCurrentStep("pay")}
            className="bg-[#6D4C41] text-white font-bold py-2 px-4 rounded-lg mb-4 hover:bg-[#5e4233] transition duration-200 font-roboto"
          >
            Proceed to Payment
          </button>
          <button
            onClick={() => setCurrentStep("choose")}
            className="border-2 border-[#6D4C41] text-[#6D4C41] font-bold py-2 px-4 rounded-lg hover:bg-[#6D4C41] hover:text-white transition duration-200 font-roboto"
          >
            Back to Menu
          </button>
        </>
      )}
      {currentStep === "pay" && (
        <div className="w-full max-w-sm bg-white shadow-xl p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-[#6D4C41] mb-6 font-crimson-text">
            Cash Payment at Cơm Việt
          </h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              downloadReceipt();
            }}
            className="flex flex-col space-y-4"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="border-2 border-[#6D4C41] rounded-lg p-2 font-roboto"
              required
            />
            <input
              type="number"
              name="amount"
              value={calculateTotal()}
              disabled
              className="border-2 border-[#6D4C41] rounded-lg p-2 font-roboto"
            />
            <input
              type="text"
              name="note"
              placeholder="Note (optional)"
              className="border-2 border-[#6D4C41] rounded-lg p-2 font-roboto"
            />
            <button
              type="submit"
              className="bg-[#6D4C41] text-white font-bold py-2 rounded-lg hover:bg-[#5e4233] transition duration-200 font-roboto"
            >
              Download Receipt
            </button>
          </form>
          <button
            onClick={() => setCurrentStep("choose")}
            className="border-2 border-[#6D4C41] text-[#6D4C41] font-bold py-2 px-4 rounded-lg mt-4 hover:bg-[#6D4C41] hover:text-white transition duration-200 font-roboto"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
