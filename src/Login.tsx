import * as React from "react";
import { MainComponent } from "./MainComponent";

function Login() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [errors, setErrors] = React.useState({ login: "", signup: "" });
  const [users, setUsers] = React.useState([]);
  const [[A, B], setCaptcha] = React.useState([
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const usernameOrEmail = form.usernameOrEmail?.value;
    const password = form.password.value;
    if (isSignUp) {
      const captcha = form.captcha?.value;
      const newUser = {
        username: usernameOrEmail,
        email: usernameOrEmail,
        password,
      };
      if (parseInt(captcha) !== A + B) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          signup: "Captcha incorrect",
        }));
        setCaptcha([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
        return;
      }
      setCaptcha([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
      setUsers([...users, newUser]);
      setIsSignUp(false);
      setErrors({ login: "", signup: "" });
    } else {
      const userExists = users.find(
        (user) =>
          (user.username === usernameOrEmail ||
            user.email === usernameOrEmail) &&
          user.password === password
      );
      if (!userExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          login: "Invalid credentials",
        }));
        return;
      }
      setIsAuthenticated(true);
      setErrors({ login: "", signup: "" });
    }
  };
  if (isAuthenticated) {
    return <MainComponent />;
  }
  return (
    <div className="flex justify-center items-center h-screen bg-[#f7f7f7]">
      <div className="w-full max-w-md bg-white rounded shadow-md p-6">
        <h1 className="text-2xl font-roboto text-center mb-6">
          {isSignUp ? "Sign Up" : "Login"}
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {errors.login && (
            <p className="text-red-500 text-sm font-roboto">{errors.login}</p>
          )}
          {errors.signup && (
            <p className="text-red-500 text-sm font-roboto">{errors.signup}</p>
          )}
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block text-sm font-roboto mb-2"
            >
              {isSignUp ? "Username or Email" : "Username/Email"}
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              id="usernameOrEmail"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-roboto mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {isSignUp && (
            <div>
              <label
                htmlFor="captcha"
                className="block text-sm font-roboto mb-2"
              >
                Captcha: {A + " + " + B} = ?
              </label>
              <input
                type="number"
                name="captcha"
                id="captcha"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-roboto"
          >
            Submit
          </button>
        </form>
        <p className="mt-6 text-sm font-roboto text-center">
          {isSignUp ? (
            <button
              onClick={() => setIsSignUp(false)}
              className="text-blue-500"
            >
              Already have an account? Login!
            </button>
          ) : (
            <button onClick={() => setIsSignUp(true)} className="text-blue-500">
              Don't have an account? Sign Up!
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export { Login }