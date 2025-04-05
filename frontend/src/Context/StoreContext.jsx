import { createContext, useEffect, useState } from "react";
import axios from "axios";




export const StoreContext = createContext(null);

// context สามารถส่งได้เลยโดยไม่ต้องคอยส่งเข้า props

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [parts_list, setPartsList] = useState([]);
    const [product_list, setProductList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [discountApplied, setDiscountApplied] = useState(false);
    const [metaMaskAccount, setMetaMaskAccount] = useState(null);
    const [Balance , setBalance] = useState(null)


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = parts_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchPartsList = async () => {
        const response = await axios.get(url + "/api/parts/list");
        setPartsList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }
    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setMetaMaskAccount(accounts[0]);  
                saveMetaMaskAccount(accounts[0]); 
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    // ทำการ save metamaskaccount ซึ่งคือเก็บ public key ลงไปใน DB
    const saveMetaMaskAccount = async (account) => {
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
        let DataSend = {
            userId: token, 
            metaMaskAccount: account
        };
   
        try {
            const response = await axios.post("http://localhost:4000/api/user/addmetamask", DataSend, { headers: { token } });
   
            if (response.data.message === "MetaMask account saved") {
                console.log("MetaMask account saved:", response.data.user);
                // SAVE ลง localstorage
                localStorage.setItem("metaMaskAccount", account);
            }
        } catch (error) {
            console.error("Error saving MetaMask account:", error.response ? error.response.data : error);
        }
    };

    const getBalance = async (props)=> {  
       // console.log(props);
        try {
            const response = await axios.get(url+`/api/contract/getBalance?userAddress=${props}`)
           // console.log(response.data.balance);
            setBalance(response.data.balance);
        } catch (error) {
            console.log(error);
        }
    }

    
    useEffect(() => {
        async function loadData() {
            await fetchPartsList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
            const storedMetaMaskAccount = localStorage.getItem("metaMaskAccount");
            if (storedMetaMaskAccount) {
                console.log("MetaMask account found in localStorage:", storedMetaMaskAccount);
                setMetaMaskAccount(localStorage.getItem("metaMaskAccount"))
                getBalance(localStorage.getItem("metaMaskAccount"));
            } else {
                console.log("No MetaMask account found, please connect your wallet.");
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        parts_list,
        product_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        discountApplied,
        token,
        setToken,
        loadCartData,
        setCartItems,
        metaMaskAccount,    // Include MetaMask account in context
        connectMetaMask,
        Balance,
        setBalance,
        fetchPartsList
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;