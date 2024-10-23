"use client";

import apiClient from "@/app/lib/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { message, Modal } from "antd";
import type {
  EditTransaction,
  NewTransaction,
  Transaction,
} from "@/app/types/acc";
import { create } from "zustand";

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (
    transaction: NewTransaction,
    userId: number
  ) => Promise<void>;
  editTransaction: (transaction: EditTransaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],

  addTransaction: async (transaction) => {
    try {
      const userIdResponse = await apiClient.get("/user/userId");

      const userId = userIdResponse.data;

      const transactionWithUserId = { ...transaction, userId };

      const response = await apiClient.post(
        "/transaction/add-transaction",
        transactionWithUserId
      );

      toast.success("Transaction added successfully");

      set((state) => ({
        transactions: [...state.transactions, response.data],
      }));
    } catch (error) {
      console.error("Failed to add transaction", error);
      toast.error("Failed to add transaction");
    }
  },

  editTransaction: async (transaction) => {
    const { account, ...transactionData } = transaction;

    try {
      const response = await apiClient.put(
        `/transaction/${transaction.id}`,
        transactionData
      );

      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === transaction.id ? response.data : t
        ),
      }));

      toast.success("Transaction edited successfully");
    } catch (error) {
      console.error("Failed to edit transaction", error);
      toast.error("Failed to edit transaction");
    }
  },

  deleteTransaction: async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this transaction?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "No, cancel",
      async onOk() {
        try {
          const transactionResponse = await apiClient.get(`/transaction/${id}`);
          const transaction = transactionResponse.data;
          const { type, amount, accountId } = transaction;

          let updatedBalance = transaction.account.balance;

          if (type === "Deposit") {
            updatedBalance -= amount;
          } else if (type === "Withdrawal" || type === "Transfer") {
            updatedBalance += amount;
          }
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          }));

          await apiClient.delete(`/transaction/${id}`, {
            data: { balance: updatedBalance, accountId: accountId },
          });

          message.success("Transaction deleted successfully");
        } catch (error) {
          set((state) => ({
            transactions: [...state.transactions],
          }));
          message.error("An error occurred while deleting the transaction.");
          console.error("Delete Transaction Error:", error);
        }
      },
    });
  },

  fetchTransactions: async () => {
    try {
      const userIdResponse = await apiClient.get("/user/userId");
      const userId = userIdResponse.data;
      const response = await apiClient.get(`/transaction/user/${userId}`);
      set({ transactions: response.data });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      toast.error("Failed to fetch transactions");
    }
  },
}));
