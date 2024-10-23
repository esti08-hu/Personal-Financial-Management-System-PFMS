import apiClient from "@/app/lib/axiosConfig";
import type { Account, EditTransaction } from "@/app/types/acc";
import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { toast } from "react-toastify";
import { string } from "zod";

type ModelProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  editTransactionData: EditTransaction;
};

const Model: React.FC<ModelProps> = ({
  isEditing,
  setIsEditing,
  handleUpdate,
  handleChange,
  editTransactionData,
}) => {
  const [accountId, setAccountId] = useState<number>(
    editTransactionData.account.id
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string>("");
  const [originalAmount, setOriginalAmount] = useState<number>(
    (editTransactionData.amount)
  );
  const [originalData, setOriginalData] = useState(editTransactionData);
  const [originalType, setOriginalType] = useState<string>(
    String(editTransactionData.type)
  );
  const [newBalance, setNewBalance] = useState(
    Number(editTransactionData.account.balance)
  );
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const fetchAccounts = async (userId: number) => {
    try {
      const response = await apiClient.get(`/account/${userId}`);
      const data = response.data;
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
      toast.error("Failed to fetch accounts");
      setAccounts([]);
    }
  };

    // Helper function to calculate the new balance based on transaction type and amount
    const calculateNewBalance = (newType: string, newAmount: number) => {
      const selectedAccount = accounts.find((acc) => acc.id === accountId);
  
      if (selectedAccount) {
        let updatedBalance = selectedAccount.balance;
  
        if (newType === "Deposit") {
          updatedBalance += newAmount;
        } else if (newType === "Withdrawal" || newType === "Transfer") {
          updatedBalance -= newAmount;
          if (updatedBalance < 0) {
            setError("Amount exceeds account balance");
            return;
          }
        }
        setNewBalance(updatedBalance);
        setError("");
      }
    };

    // Handle changes in transaction type
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      const newAmount = Number(editTransactionData.amount);

      handleChange(e);
      calculateNewBalance(newType, newAmount);
    };
  
    // Handle changes in the transaction amount
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = Number(e.target.value);
      const newType = editTransactionData.type;
  
      handleChange(e);
      calculateNewBalance(newType, newAmount);
    };
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccountId = Number(e.target.value);
    setAccountId(Number(e.target.value));
    const selectedAccount = accounts.find(
      (acc) => acc.id === selectedAccountId
    );

    if (selectedAccount) {
      handleChange({
        ...e,
        target: {
          ...e.target,
          name: "accountId",
          value: selectedAccount.id.toString(),
        },
      });

      setNewBalance(selectedAccount.balance);
    }
  };

  useEffect(() => {
    const fetchUserIdAndAccounts = async () => {
      try {
        const userIdResponse = await apiClient.get("/user/userId");
        const userId = userIdResponse.data;
        fetchAccounts(userId);
      } catch (error) {
        console.error("Failed to fetch user ID", error);
        toast.error("Failed to fetch user ID");
      }
    };

    fetchUserIdAndAccounts();
  }, []);

  const checkIfFormChanged = () => {
    const hasChanged =
      accountId !== originalData.account.id ||
      Number(editTransactionData.amount) !== originalData.amount ||
      editTransactionData.type !== originalData.type ||
      editTransactionData.createdAt!== originalData.createdAt ||
      editTransactionData.description !== originalData.description;

    // Enable or disable the Save button based on changes
    setIsSaveDisabled(!hasChanged);
  };

  useEffect(() => {
    checkIfFormChanged();
  }, [accountId, editTransactionData]);

  if (!isEditing) return null;

  return (
    <div
      style={{ backgroundColor: "rgba(0, 172, 205, 0.35)" }}
      id="crud-modal"
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-graydark dark:text-gray-800">
              Edit Transaction Form
            </h3>
            <button
              type="button"
              className="text-gray bg-transparent hover:bg-gray-200 hover:text-gray-400 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-400 dark:hover:text-white"
              data-modal-toggle="crud-modal"
              onClick={() => setIsEditing(false)}
            >
              <HiOutlineX className="text-2xl hover:bg-gray-2 hover:text-graydark" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form className="p-4 md:p-5" onSubmit={handleUpdate}>
            <div className="grid mb-4 grid-cols-2">
              <div className="col-span-2 mb-4">
                <label
                  htmlFor="type"
                  className="block mb-2 text-sm font-medium text-graydark"
                >
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={editTransactionData.type}
                  onChange={handleTypeChange}
                  className="border border-gray text-graydark text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option>Deposit</option>
                  <option>Transfer</option>
                  <option>Withdrawal</option>
                </select>
              </div>

              <div className="col-span-2 mb-4">
                <label
                  htmlFor="account"
                  className="block mb-2 text-sm font-medium text-graydark"
                >
                  Account:
                </label>
                <select
                  id="accountId"
                  name="accountId"
                  value={accountId}
                  onChange={handleAccountChange}
                  className="border border-gray text-graydark text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="" disabled>
                    Select an account
                  </option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.title} ({acc.balance} ETB)
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-graydark"
                >
                  Amount
                </label>
                <input
                  name="amount"
                  type="number"
                  id="amount"
                  min={1}
                  value={editTransactionData.amount}
                  onChange={handleAmountChange}
                  className="border border-gray text-graydark text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>

              <div className="min-h-[24px] w-90">
                {error && <p className="text-red w-full">{error}</p>}
              </div>

              <div className="col-span-2 mb-4">
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium text-graydark"
                >
                  Date
                </label>
                <input
                  type="date"
                  name="createdAt"
                  id="date"
                  value={
                    new Date(editTransactionData.createdAt)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={handleChange}
                  className="border border-gray text-graydark text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-graydark"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editTransactionData.description}
                  onChange={handleChange}
                  className="block p-2.5 w-full text-sm text-graydark rounded-lg border border-gray focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  required
                  minLength={2}
                />
              </div>
            </div>
            <button
              type="submit"
              className={`flex justify-center rounded px-6 py-2 font-medium text-white ${
                !isSaveDisabled
                  ? "bg-[#00ABCD] hover:bg-opacity-90"
                  : "bg-gray cursor-not-allowed"
              }`}
              disabled={isSaveDisabled}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Model;
