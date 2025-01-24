import { useState } from "react";

const HomeLoanEMICalculator = () => {
    const [loanAmount, setLoanAmount] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [loanTenure, setLoanTenure] = useState("");
    const [emi, setEmi] = useState(null);
    const [totalInterest, setTotalInterest] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [isMonthly, setIsMonthly] = useState(true);

    const calculateEMI = () => {
        if (loanAmount && interestRate && loanTenure) {
            const principal = parseFloat(loanAmount);
            const rateOfInterest = parseFloat(interestRate) / 100 / 12;
            const tenureInMonths = parseInt(loanTenure) * 12;
    
            let emiAmount;
            let totalInterestAmount;
            let totalAmountToPay;
    
            if (isMonthly) {
                emiAmount =
                    (principal *
                        rateOfInterest *
                        Math.pow(1 + rateOfInterest, tenureInMonths)) /
                    (Math.pow(1 + rateOfInterest, tenureInMonths) - 1);
                totalInterestAmount = emiAmount * tenureInMonths - principal;
                totalAmountToPay = emiAmount * tenureInMonths;
                setEmi(Math.round(emiAmount)); 
            } else {
                // For Yearly EMI
                const yearlyRate = parseFloat(interestRate) / 100; // Yearly Interest Rate
                const tenureInYears = parseInt(loanTenure);
                emiAmount =
                    (principal * yearlyRate) /
                    (1 - Math.pow(1 + yearlyRate, -tenureInYears)); // Formula for Yearly EMI
                totalInterestAmount = emiAmount * tenureInYears - principal;
                totalAmountToPay = emiAmount * tenureInYears;
                setEmi(Math.round(emiAmount)); // Yearly EMI (rounded)
            }
    
            setTotalInterest(Math.round(totalInterestAmount)); 
            setTotalAmount(Math.round(totalAmountToPay)); 
        }
    };
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row w-full max-w-screen-xl p-6 bg-white rounded-lg shadow-lg border-t-2 border-gray-300">
                {/* Left section: EMI calculator form */}
                <div className="flex-1 p-6 bg-white rounded-lg lg:mr-6 mb-6 lg:mb-0">
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">
                            Home Loan EMI Calculator
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Form for Loan Amount */}
                        <div>
                            <label
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor="loanAmount"
                            >
                                Loan Amount
                            </label>
                            <input
                                type="number"
                                id="loanAmount"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                                placeholder="Enter loan amount"
                            />
                        </div>

                        {/* Form for Interest Rate */}
                        <div>
                            <label
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor="interestRate"
                            >
                                {isMonthly
                                    ? "Monthly Interest Rate (%)"
                                    : "Annual Interest Rate (%)"}
                            </label>
                            <input
                                type="number"
                                id="interestRate"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                                placeholder={
                                    isMonthly
                                        ? "Enter monthly interest rate"
                                        : "Enter annual interest rate"
                                }
                            />
                        </div>

                        {/* Form for Loan Tenure */}
                        <div>
                            <label
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor="loanTenure"
                            >
                                Loan Tenure (in years)
                            </label>
                            <input
                                type="number"
                                id="loanTenure"
                                value={loanTenure}
                                onChange={(e) => setLoanTenure(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                                placeholder="Enter tenure in years"
                            />
                        </div>

                        {/* Monthly/Yearly EMI Toggle */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                                <label className="text-gray-700">Calculate EMI: </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="monthly"
                                        name="emiType"
                                        checked={isMonthly}
                                        onChange={() => setIsMonthly(true)}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="monthly"
                                        className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer border-2 transition-all duration-300 ${isMonthly
                                            ? "bg-[#2E4156] text-white border-[#2E4156]"
                                            : "bg-white text-gray-700 border-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`w-3 h-3 rounded-full ${isMonthly ? "bg-white" : ""}`}
                                        />
                                    </label>
                                    <span className="text-gray-700">Monthly</span>

                                    <input
                                        type="radio"
                                        id="yearly"
                                        name="emiType"
                                        checked={!isMonthly}
                                        onChange={() => setIsMonthly(false)}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="yearly"
                                        className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer border-2 transition-all duration-300 ${!isMonthly
                                            ? "bg-[#2E4156] text-white border-[#2E4156]"
                                            : "bg-white text-gray-700 border-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`w-3 h-3 rounded-full ${!isMonthly ? "bg-white" : ""}`}
                                        />
                                    </label>
                                    <span className="text-gray-700">Yearly</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={calculateEMI}
                            className="w-full bg-[#2E4156] text-white py-3 rounded-lg font-semibold hover:bg-[#1A2D42] transition duration-300"
                        >
                            Calculate EMI
                        </button>
                    </div>
                </div>

                {/* Right section: Results */}
                <div className="flex-1 p-6 bg-white rounded-lg mt-6 lg:mt-0">
                    <div className="space-y-10 mt-12 flex-1">
                        {/* Loan EMI */}
                        <div className="flex flex-col">
                            <h3 className="block text-gray-700 font-semibold mb-2">Loan EMI</h3>
                            <p className="text-2xl font-semibold">
                                <span className="text-sm text-gray-500">NRS</span> {emi && emi}
                            </p>
                        </div>
                        <div className="border-b border-gray-300"></div>

                        {/* Total Interest Payable */}
                        <div className="flex flex-col">
                            <h3 className="block text-gray-700 font-semibold mb-2">Total Interest Payable</h3>
                            <p className="text-2xl font-semibold">
                                <span className="text-sm text-gray-500">NRS</span> {totalInterest && totalInterest}
                            </p>
                        </div>
                        <div className="border-b border-gray-300"></div>

                        {/* Total of Payments */}
                        <div className="flex flex-col">
                            <h3 className="block text-gray-700 font-semibold mb-2">
                                Total of Payments (Principal + Interest)
                            </h3>
                            <p className="text-2xl font-semibold">
                                <span className="text-sm text-gray-500">NRS</span> {totalAmount && totalAmount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeLoanEMICalculator;