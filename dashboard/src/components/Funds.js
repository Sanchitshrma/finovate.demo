import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import Modal from "./Modal";

const Funds = () => {
  const [loading, setLoading] = useState(true);
  const [fundsData, setFundsData] = useState({
    openingBalance: 50000,
    availableMargin: 50000,
    usedMargin: 0,
    availableCash: 50000,
  });
  const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchFundsData();
  }, []);

  const fetchFundsData = async () => {
    try {
      setLoading(true);
      
      // Fetch holdings to calculate used margin
      const holdingsRes = await api.get("/allHoldings");
      const holdings = holdingsRes.data;

      // Calculate used margin (total investment)
      const usedMargin = holdings.reduce(
        (sum, h) => sum + h.avg * h.qty,
        0
      );

      const openingBalance = 50000; // Virtual starting balance
      const availableMargin = openingBalance - usedMargin;

      setFundsData({
        openingBalance,
        availableMargin,
        usedMargin,
        availableCash: availableMargin,
      });
    } catch (error) {
      console.error("Failed to fetch funds data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const handleAddFunds = () => {
    setModal({
      isOpen: true,
      type: 'info',
      title: 'Virtual balance',
      message: 'This demo uses a fixed virtual starting balance. Adding real money or topping up the demo balance is not supported.'
    });
  };

  const handleWithdraw = () => {
    if (fundsData.availableCash <= 0) {
      setModal({
        isOpen: true,
        type: 'warning',
        title: 'No withdrawable funds',
        message: 'This is a virtual demo balance. Withdrawals and bank transfers are not supported.'
      });
    } else {
      setModal({
        isOpen: true,
        type: 'info',
        title: 'Virtual balance',
        message: 'This is a virtual demo balance. Withdrawals and bank transfers are not supported.'
      });
    }
  };

  const handleOpenCommodity = () => {
    setModal({
      isOpen: true,
      type: 'info',
      title: 'Demo scope',
      message: 'Commodity trading and commodity accounts are not available in this demo.'
    });
  };

  const handleModalClose = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <>
      <Modal 
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      
      <div className="funds">
        <p>Virtual balance for paper trading. Payments, deposits, withdrawals, and bank links are not supported.</p>
        <button type="button" className="btn btn-green" onClick={handleAddFunds}>Add virtual funds</button>
        <button type="button" className="btn btn-blue" onClick={handleWithdraw}>Withdraw virtual funds</button>
      </div>

      <div className="row funds-row">
        <div className="col funds-col">
          <span>
            <p>Equity {loading && <span style={{ fontSize: '12px', color: '#999' }}>Loading...</span>}</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Virtual funds available</p>
              <p className="imp colored">₹{formatCurrency(fundsData.availableMargin)}</p>
            </div>
            <div className="data">
              <p>Virtual funds used</p>
              <p className="imp">₹{formatCurrency(fundsData.usedMargin)}</p>
            </div>
            <div className="data">
              <p>Available virtual cash</p>
              <p className="imp">₹{formatCurrency(fundsData.availableCash)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Starting virtual balance</p>
              <p>₹{formatCurrency(fundsData.openingBalance)}</p>
            </div>
          </div>
        </div>

        <div className="col funds-col">
          <div className="commodity">
            <p>Commodity trading is not included in this paper-trading demo.</p>
            <button type="button" className="btn btn-blue" onClick={handleOpenCommodity}>Demo details</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
