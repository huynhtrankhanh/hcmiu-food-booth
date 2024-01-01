import * as React from "react";

function MainComponent() {
  const [currentStage, setCurrentStage] = React.useState("chooseFood");
  const [selectedDishes, setSelectedDishes] = React.useState<{ [key: string]: {description: string, price: number, quantity: number } }>({});
  const [_totalAmount, setTotalAmount] = React.useState(0);
  const [adminPassword, setAdminPassword] = React.useState("");
  const [adminInterface, setAdminInterface] = React.useState(false);
  const [orders, setOrders] = React.useState<{id: number, dishes:{ [key: string]: {description: string, price: number, quantity: number } },totalAmount:number,fulfilled:boolean}[]>([]);
  const dishes: {[key: string]: {description: string, price: number}} = {
    Pho: {
      description:
        "Pho is a harmonious harmony combination of many traditional and healthy ingredients",
      price: 35000,
    },
    BraisedMeatRice: {
      description:
        "Braised pork is a familiar dish on the Vietnamese dinner table. The dish carries with it many cultural beauties of the country and people",
      price: 30000,
    },
    NamVangNoodles: {
      description:
        "The main ingredients of noodles are noodles, the main broth is minced meat and pork intestines cooked together.",
      price: 35000,
    },
    Apple: { description:"",price: 7000 },
    SoftDrinks: {
      description: "Coca-cola / Pepsi / Sprite / Fanta / Sting / 7-up",
      price: 10000,
    },
    BeefRiceNoodles: {
      description:
        "Beef rice noodle soup's main ingredients are vermicelli, beef shank, pork sausage, pork sausage, boiled blood and a characteristic red broth.",
      price: 35000,
    },
    ComTam: {
      description:
        "A typical dish of the Southern Vietnam region, considered a traditional and popular dish",
      price: 30000,
    },
    BraisedFishRice: {
      description: "Braised fish is a familiar dish of Western Vietnam people",
      price: 30000,
    },
    Pineapple: {description:"", price: 8000 },
  };
  const handleDishSelect = (dishName: string) => {
    setSelectedDishes((prevSelectedDishes) => {
      const currentQuantity = prevSelectedDishes[dishName]?.quantity || 0;
      return {
        ...prevSelectedDishes,
        [dishName]: { quantity: currentQuantity + 1, ...dishes[dishName] },
      };
    });
  };
  const handleDishRemoval = (dishName:string) => {
    setSelectedDishes((prevSelectedDishes) => {
      const updatedDishes = { ...prevSelectedDishes };
      delete updatedDishes[dishName];
      return updatedDishes;
    });
  };
  const handleQuantityChange = (dishName:string, newQuantity:number) => {
    setSelectedDishes((prevSelectedDishes) => ({
      ...prevSelectedDishes,
      [dishName]: { ...prevSelectedDishes[dishName], quantity: newQuantity },
    }));
  };
  const calculateTotal = () => {
    return Object.values(selectedDishes).reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0
    );
  };
  const handleCheckout = () => {
    setTotalAmount(calculateTotal());
    setCurrentStage("reviewCart");
  };
  const handlePayment = () => {
    const nextOrderId = Math.max(0, ...orders.map((order) => order.id)) + 1;
    const newOrder = {
      id: nextOrderId,
      dishes: selectedDishes,
      totalAmount: calculateTotal(),
      fulfilled:false
    };
    setOrders([...orders, newOrder]);
    setCurrentStage("payment");
  };
  const handleDownloadReceipt = () => {
    const receiptContent =
      `Receipt\n----------\n` +
      Object.entries(selectedDishes)
        .map(
          ([name, { price, quantity }]) =>
            `${name}: ${price.toLocaleString("vi-VN")} VND x ${quantity}`
        )
        .join("\n") +
      `\n----------\nTotal: ${calculateTotal().toLocaleString("vi-VN")} VND`;
    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });
    const receiptUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = receiptUrl;
    link.download = "receipt.txt";
    link.click();
    window.URL.revokeObjectURL(receiptUrl);
  };
  const handleAdminLogin = (e:any) => {
    e.preventDefault();
    if (adminPassword === "admin") {
      setAdminInterface(true);
      setCurrentStage("");
    }
  };
  const handleFulfillOrder = (orderId:number) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) return { ...order, fulfilled: true };
        return order;
      })
    );
  };
  const handleAdminExit = () => {
    setAdminInterface(false);
    setAdminPassword("");
    setCurrentStage("chooseFood");
  };
  const handleResetOrder = () => {
    setSelectedDishes({});
    setTotalAmount(0);
    setCurrentStage("chooseFood");
  };
  const renderDish = (dishName:string, dish:{description: string, price: number }) => {
    const isSelected = selectedDishes[dishName];
    const dishQuantity = isSelected ? selectedDishes[dishName].quantity : 0;
    return (
      <div
        key={dishName}
        className={`p-4 m-2 ${
          isSelected ? "border-4 border-red-500" : "border-2 border-gray-300"
        }`}
      >
        <img src={"/dishes/" + dishName.replace(/([A-Z])/g, "-$1").trim().toLowerCase().substring(1) + ".jpg"} />
        <p className="text-[#121212] text-lg mb-2">
          {dishName.replace(/([A-Z])/g, " $1").trim()}
        </p>
        {dish.description && <p className="text-sm mb-2">{dish.description}</p>}
        <p className="text-sm mb-2">
          Price: {dish.price.toLocaleString("vi-VN")} VND
        </p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleDishSelect(dishName)}
            className="bg-green-500 text-white p-1.5 text-xs mb-2"
          >
            Add
          </button>
          {isSelected && (
            <>
              <div className="flex items-center">
                <button
                  onClick={() =>
                    handleQuantityChange(dishName, dishQuantity - 1)
                  }
                  disabled={dishQuantity <= 1}
                  className="bg-red-400 text-white p-1.5 text-xs mr-4"
                >
                  -
                </button>
                <span className="text-sm">{dishQuantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(dishName, dishQuantity + 1)
                  }
                  className="bg-green-400 text-white p-1.5 text-xs ml-4"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleDishRemoval(dishName)}
                className="bg-red-500 text-white p-1.5 text-xs"
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    );
  };
  const renderFoodSelection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(dishes).map(([dishName, dish]) =>
        renderDish(dishName, dish)
      )}
      {Object.keys(selectedDishes).length > 0 && (
        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white p-2 mt-4 col-span-1 sm:col-span-2 lg:col-span-3"
        >
          Checkout
        </button>
      )}
    </div>
  );
  const renderShoppingCart = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Review Shopping Cart</h2>
      {Object.entries(selectedDishes).map(([name, { price, quantity }]) => (
        <div key={name} className="p-4 m-2 border-4 border-red-500 font-bold">
          <h3 className="text-[#121212]">
            {name.replace(/([A-Z])/g, " $1").trim()}
          </h3>
          <p className="text-sm">
            Price: {price.toLocaleString("vi-VN")} VND x {quantity}
          </p>
        </div>
      ))}
      <div className="text-lg mb-4">
        Total: {calculateTotal().toLocaleString("vi-VN")} VND
      </div>
      <button onClick={handlePayment} className="bg-green-500 text-white p-2">
        Pay with Cash
      </button>
    </div>
  );
  const renderPayment = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Payment</h2>
      <p className="mb-4">
        Cash payment received. Total paid:{" "}
        {calculateTotal().toLocaleString("vi-VN")} VND
      </p>
      <button
        onClick={handleDownloadReceipt}
        className="bg-yellow-500 text-[#121212] p-2"
      >
        Download Receipt
      </button>
      <button
        onClick={() => window.open("https://lively-kataifi-cf3f63.netlify.app/#HCMIUFoodBooth"+(Math.random()).split(".").join(""))}
        className="bg-blue-500 text-[#121212] p-2"
      >
        View Driver Location
      </button>
      <button
        onClick={handleResetOrder}
        className="bg-red-500 text-white p-2 mt-4"
      >
        Return to Dish Selection
      </button>
    </div>
  );
  const renderAdminInterface = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin Interface</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          className={`p-4 my-2 ${
            order.fulfilled
              ? "border-4 border-green-500"
              : "border-4 border-yellow-500"
          }`}
        >
          <h3 className="font-bold text-[#121212] mb-2">{`Order #${order.id}`}</h3>
          {Object.entries(order.dishes).map(([name, { price, quantity }]) => (
            <p key={name} className="text-sm">{`- ${name
              .replace(/([A-Z])/g, " $1")
              .trim()}: ${price.toLocaleString("vi-VN")} VND x ${quantity}`}</p>
          ))}
          <div className="text-right mb-2">
            <strong>Total:</strong> {order.totalAmount.toLocaleString("vi-VN")}{" "}
            VND
          </div>
          {!order.fulfilled && (
            <button
              onClick={() => handleFulfillOrder(order.id)}
              className="bg-green-500 text-white p-1.5"
            >
              Mark as Fulfilled
            </button>
          )}
        </div>
      ))}
      <button
        onClick={handleAdminExit}
        className="bg-red-500 text-white p-2 mt-4"
      >
        Exit Admin Interface
      </button>
    </div>
  );
  const renderAdminLogin = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Enter Admin Password</h2>
      <form onSubmit={handleAdminLogin}>
        <input
          type="password"
          name="adminPassword"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          className="p-2 border-2 m-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
  return (
    <div className="font-roboto p-4">
      <button
        onClick={() => setCurrentStage("admin")}
        className="w-full bg-red-600 text-white p-4 font-bold"
      >
        Jump to Admin Interface
      </button>
      <div className="mt-4">
        {currentStage === "chooseFood" && renderFoodSelection()}
        {currentStage === "reviewCart" && renderShoppingCart()}
        {currentStage === "payment" && renderPayment()}
        {adminInterface && renderAdminInterface()}
        {currentStage === "admin" && !adminInterface && renderAdminLogin()}
      </div>
      <style>{`
        .border-solid {
          border-style: solid;
        }
        .border-dashed {
          border-style: dashed;
        }
      `}</style>
    </div>
  );
}

export { MainComponent };
