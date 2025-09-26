const shoeList = document.getElementById("Shoe-Brands");
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const description = document.getElementById("description");
const availableItems = document.getElementById("available-items");
const selectedShoes = document.getElementById("available-shoes");
const addToCartBtn = document.getElementById("add-to-cart");
const buyBtn = document.getElementById("purchase");
const searchForm = document.getElementById("shoe-search"); 
const styleFilter = document.getElementById("style-filter"); 
const sizeFilter = document.getElementById("size-filter"); 

let selectedPairs = 0;
let currentShoe = null;
let allShoesData = []; 

const options = {
  method: "GET",
  headers: {
    Accept: "/",
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": "EchoapiRuntime/1.1.0",
    Connection: "keep-alive",
  },
};

// Asynchronous Fetching
fetch('http://localhost:3051/shoes', options)
  .then((response) => response.json())
  .then((shoes) => {
    allShoesData = shoes; 
    displayBrands(allShoesData);
    if (allShoesData.length > 0) showShoe(allShoesData[0]);
  })
  .catch((err) => console.error("Error fetching shoes:", err));

// Array Iteration: Using forEach to render the brand list
function displayBrands(shoes) {
  shoeList.innerHTML = "";

  shoes.forEach((shoe) => {
    const li = document.createElement("li");
    li.textContent = shoe.name;
    // Click event listener
    li.addEventListener("click", () => showShoe(shoe));
    shoeList.appendChild(li);
  });
}

function showShoe(shoe) {
  currentShoe = shoe;
  poster.src = shoe.image;
  title.textContent = shoe.name;
  description.textContent = shoe.description;
  availableItems.textContent = `${shoe.size} (${shoe.size_type})`;
}

// Create a function to filter shoes
function filterShoes() {
  const searchTerm = searchForm.search.value.toLowerCase();
  const selectedStyle = styleFilter.value;
  const selectedSize = sizeFilter.value;
    //iterate using.filter
  const filtered = allShoesData.filter(shoe => {
    // 1. Check Search Term- the name and description
    const matchesSearch = shoe.name.toLowerCase().includes(searchTerm) || 
    shoe.description.toLowerCase().includes(searchTerm);

    // 2. Check Style Filter
    const matchesStyle = selectedStyle === "" || shoe.style === selectedStyle;

    // 3. Check Size Filter
    const matchesSize = selectedSize === "" || shoe.size_type === selectedSize;

    return matchesSearch && matchesStyle && matchesSize;
  });

  displayBrands(filtered);
  //Check for the first filtered shoe details, or clear if none found
  if (filtered.length > 0) {
    showShoe(filtered[0]);
  } else {
    showShoe({
      name: "No Shoes Found",
      description: "Try adjusting your filters or search term.",
      image: "https://imgs.search.brave.com/-GXIMAMiJ6cSNm6qDtxTtN-DUGPmRMkC6Yjk7hHjGNs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODU3/NTI5NzcwL3ZlY3Rv/ci9icm9rZW4tcm9i/b3QtNDA0LXBhZ2Ut/bm90LWZvdW5kLWVy/cm9yLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz15T3JZOXJI/ajdqN09XNU9NalhU/SVJ5UXpvR01XSXI4/RzhGVmxkbTRrdkpv/PQ",
      size: "-",
      size_type: ""
    });
  }
}

// 1. Submit Event Listener on Search Form
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterShoes();
});

// 2. Change Event Listener on Style Filter
styleFilter.addEventListener("change", filterShoes);

// 3. Change Event Listener on Size Filter
sizeFilter.addEventListener("change", filterShoes);

// Click event for Add to Cart
addToCartBtn.addEventListener("click", () => {
  selectedPairs++;
  selectedShoes.textContent = selectedPairs;
});

// Click event for Buy
buyBtn.addEventListener("click", () => {
  if (currentShoe && selectedPairs > 0) {
    alert(`Thank you for buying ${selectedPairs} pair(s) of "${currentShoe.name}"`);
    selectedPairs = 0;
    selectedShoes.textContent = 0;
  } else if (selectedPairs === 0) {
      alert("Please add items to your cart before buying!");
  }
});