# Cơm Việt - HCMIU Food Booth Application User Manual

Thank you for choosing the Cơm Việt - HCMIU Food Booth Application! This user-friendly application allows you to select from a variety of dishes, review your shopping cart, and download a receipt after making a payment. Below you'll find step-by-step instructions on how to install and navigate the application.

## Installation

Before using the application, you will need to install Node.js and npm (Node Package Manager), if they're not already installed on your system. Follow these steps to get everything set up:

1. **Install Node.js and npm:**

   - Visit the Node.js website at https://nodejs.org/ and download the latest stable version for your operating system.
   - Run the downloaded installer, which includes both Node.js and npm.
   - Follow the on-screen instructions to complete the installation.
   - To verify the installation, open your command line or terminal and run `node -v` and `npm -v`. This should show the installed versions of Node.js and npm.

2. **Install Application Dependencies:**

   - Navigate to the folder where you've saved the application using your command line or terminal.
   - Run `npm install` to install all necessary dependencies that the application requires to function.

3. **Run the Application:**

   - In the same folder, execute `npm run dev` to start the development server.
   - Once the server is up and running, the application will be accessible through a web browser.

## Usage

After you've successfully started the application, you can access it by opening your preferred web browser and navigating to the address provided in the terminal output (usually http://localhost:3000).

## User Interface

### Login and Sign Up

Upon arrival at the application, you are greeted with a straightforward form:

- If you **already have an account**, input your username or email and password in the designated fields and submit the form to log in.
- If you are a **new user**, click the "Don't have an account? Sign Up!" button to toggle the form to sign up mode. Enter your desired username or email, a password, and solve a simple arithmetic captcha to create your new account.

### Main Interface

After a successful login, you will be directed to the main interface where you can begin the process of dish selection.

#### Dish Selection

- Browse the grid of appetizing dishes, each accompanied by a thumbnail image, a description, and the price.
- To add a dish to your shopping cart, select the "Add" button next to the relevant dish. You can adjust the quantity by clicking the "+" or "-" buttons or remove it entirely with the "Remove" button.

#### Checkout

- When you're ready to review your selections, press the "Checkout" button located at the bottom of the dish selection area.
- The "Review Shopping Cart" page summarizes your selections and provides the total amount due.
- Proceed to the payment stage by clicking "Pay with Cash." This confirms that you've made a cash payment equivalent to the total amount.

#### Payment and Receipt

- Upon confirming the payment, you're directed to the payment confirmation page. Here, you can download a digital receipt by pressing the "Download Receipt" button.
- To return to the dish selection stage and reset your order, click the "Return to Dish Selection" button.

### Administrative Interface

#### Accessing Admin Interface

- To enter the administrative interface, select "Jump to Admin Interface" from the main interface.
- Enter the admin password ("admin") to gain access to the administrative features.
  
#### Managing Orders

- The administrative view displays all orders and their statuses—fulfilled or pending fulfillment.
- You can mark orders as fulfilled by selecting the corresponding button.
- Exiting the admin interface is accomplished by clicking the "Exit Admin Interface" button, returning you to the main user interface.

## User Tips

- Ensure consistent use of either a username or email while logging in to prevent any confusion.
- Regularly check your cart to manage dish quantities and avoid accidental overordering.
- When administering, mark orders assiduously, as this action updates the status and informs users of the progress promptly.

## Troubleshooting

- If you encounter issues logging in, confirm that you're using the correct credentials and captcha response.
- Should you experience any browser-related problems, refresh the page or clear your cache.
- For persistent difficulties or inquiries, kindly reach out to customer support.
