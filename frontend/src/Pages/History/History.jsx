import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { FaEthereum, FaLink, FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './History.css'

const History = () => {
  const [txData, setTxData] = useState([]);
  const [copied, setCopied] = useState(null);
  const { url, token, metaMaskAccount } = useContext(StoreContext);

  const fetchTransactions = async () => {
    try {
        console.log("Fetching transactions...");
        const response = await axios.get(`${url}/api/contract/getUserTransactions?userAddress=${metaMaskAccount}`);
        
        // Debug the raw response
        console.log("Full API response:", response);
        console.log("Response data:", response.data);
        
        if (response.data && response.data.transactions) {
          console.log("Raw transactions data:", response.data.transactions);
          response.data.transactions.reverse()
          
          const transactions = response.data.transactions.map(tx => {
            try {
              // Debug each transaction
             // console.log("Processing tx:", tx);
              
              return {
                hash: tx.hash,
                from: tx.to,
                to: metaMaskAccount,
                value: 1,
                gasPrice: tx.gasPrice ? parseInt(tx.gasPrice.hex, 16) / Math.pow(10, 9) : 0,
                gasLimit: parseInt(tx.gasLimit.hex, 16),
                blockNumber: tx.blockNumber,
                timestamp: new Date().toLocaleString(),
                status: 'completed',
                type: tx.type
              };
            } catch (txError) {
              console.error("Error processing transaction:", txError, tx);
              return null;
            }
          }).filter(tx => tx !== null); // Filter out any failed transformations
    
          console.log("Processed transactions:", transactions);
          setTxData(transactions.reverse());
        } else {
          console.warn("Unexpected response structure:", response.data);
          toast.warning("Received unexpected data format");
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast.error("Failed to fetch transactions");
      }
    };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard!");
  };



  useEffect(() => {
    if (token && metaMaskAccount) {
      fetchTransactions();
    }
  }, [token, metaMaskAccount]);

  return (
    <div className='history-page'>
      <div className="history-container">
        <h2>Transaction History</h2>
        
        {txData.length === 0 ? (
          <p className="no-transactions">No transactions found.</p>
        ) : (
          <div className="tx-table">
            <div className="tx-header">
              <div>Transaction Hash</div>
              <div>From</div>
              <div>To</div>
              <div>Value (ETH)</div>
              <div>Gas Price (Gwei)</div>
              <div>Block</div>
              <div>Date</div>
              <div>Status</div>
            </div>
            {txData.map((tx, index) => (
              <div key={index} className="tx-row">
                <div className="tx-hash-cell">
                  <FaEthereum />
                  <span title={tx.hash}>
                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(tx.hash, `table-tx-${index}`)}
                    className="copy-btn"
                  >
                    {copied === `table-tx-${index}` ? <FaCheck /> : <FaCopy />}
                  </button>
                  <button 
                    onClick={() => viewOnEtherscan(tx.hash)}
                    className="view-btn"
                  >
                    <FaLink /> View
                  </button>
                </div>
                <div className="tx-address" title={tx.from}>
                  {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                </div>
                <div className="tx-address" title={tx.to}>
                  {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : 'Contract Creation'}
                </div>
                <div>{tx.value.toFixed(6)} ETH</div>
                <div>{tx.gasPrice.toFixed(2)}</div>
                <div>Block: {tx.blockNumber}</div>
                <div>{tx.timestamp}</div>
                <div className={`status ${tx.status}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;