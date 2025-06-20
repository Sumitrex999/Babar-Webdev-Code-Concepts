console.log("Namaste Dunia");
try {
    let result = someUndefinedFunction(); // This will throw an error
    console.log(result);
} catch (error) {
    console.error("An error occurred:", error.message);
}