"use client";

import { useEffect, useState } from "react";
import Model from "@/app/components/user components/Model";
import Loader from "../../../common/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { Pagination, Tag } from "antd";
import type { EditTransaction } from "@/app/types/acc";
import { useTransactionStore } from "@/app/pages/store/transactionStore";

const TransactionList = () => {
  const {
    transactions,
    fetchTransactions,
    editTransaction,
    deleteTransaction,
  } = useTransactionStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTransactionData, setEditTransactionData] = useState<EditTransaction>({
    id: 0,
    account: { id: 0, title: "", balance: 0 },
    createdAt: "",
    type: "",
    amount: 0,
    description: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Calculate the start and end index for slicing the users array
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchTransactions();
      setIsLoading(false);
    };

    fetchData();
  }, [fetchTransactions]);

  const handleEdit = (transaction: EditTransaction) => {
    setIsEditing(true);
    setEditTransactionData(transaction);
  };

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);

    await fetchTransactions();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await editTransaction(editTransactionData);
    await fetchTransactions();
    setIsEditing(false);
    setEditTransactionData({
      id: 0,
      account: { id: 0, title: "", balance: 0 },
      createdAt: "",
      type: "",
      amount: 0,
      description: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditTransactionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        <Loader />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-2xl font-semibold text-gray-600">
          You have no transactions. Please add a transaction.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stroke rounded-sm px-6 py-8 h-full flex justify-center items-center flex-col">
      <div className="container">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-xl font-bold text-[#22577A]">Transaction List</h1>
        </div>

        <div className="">
          <table className="w-full bg-white text-sm text-left">
            <thead className="text-md border-b text-graydark uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Account</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="">
              <AnimatePresence>
                {paginatedTransactions.map((transaction) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    key={transaction.id}
                    className="bg-white text-lg border-gray hover:bg-gray-3"
                  >
                    <td  key={`${transaction.id}-type`} className="p-3 text-sm sm:text-xs md:text-sm">
                      <Tag
                        className="!z-0"
                        color={
                          transaction.type === "Deposit"
                            ? "green"
                            : transaction.type === "Withdrawal"
                            ? "red"
                            : "yellow"
                        }
                      >
                        {transaction.type}
                      </Tag>
                    </td>
                    <td key={`${transaction.id}-amount`} className="p-3 text-sm sm:text-xs md:text-sm">
                      {transaction.type === "Deposit" ? "+" : "-"}
                      {transaction.amount} ETB
                    </td>
                    <td key={`${transaction.id}-account`} className="p-3 max-w-33 text-sm sm:text-xs md:text-sm overflow-x-auto">
                      {transaction.account?.title}
                    </td>
                    <td key={`${transaction.id}-description`} className="p-3 max-w-33 text-sm sm:text-xs md:text-sm overflow-x-auto">
                      {transaction.description}
                    </td>
                    <td key={`${transaction.id}-date`} className="p-3 text-sm sm:text-xs md:text-sm whitespace-nowrap">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td key={`${transaction.id}-action`} className="p-3 text-center flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => handleEdit(transaction)}
                        className="font-bold text-lg hover:underline mr-2"
                      >
                        <HiOutlinePencilAlt className="text-2xl hover:text-[#00ABCD] text-gray" />
                      </button>
                      |
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                        className="font-bold text-lg text-red-600 dark:text-red-500 hover:underline"
                      >
                        <HiOutlineTrash className="text-2xl hover:text-danger text-gray" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {isEditing && (
          <Model
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleUpdate={handleUpdate}
            handleChange={handleChange}
            editTransactionData={editTransactionData}
          />
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        className="mt-5"
        current={currentPage}
        pageSize={pageSize}
        total={transactions.length}
        onChange={handlePageChange}
        showSizeChanger
      />
    </div>
  );
};

export default TransactionList;
