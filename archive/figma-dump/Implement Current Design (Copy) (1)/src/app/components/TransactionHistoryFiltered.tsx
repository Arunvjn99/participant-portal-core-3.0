import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Download } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: "Loan" | "Withdrawal" | "Transfer" | "Rebalance" | "Rollover";
  amount: string;
  status: "Completed" | "Processing" | "Cancelled" | "Action Required";
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Loan",
    amount: "$5,000",
    status: "Action Required",
    date: "March 6, 2026",
  },
  {
    id: "2",
    type: "Withdrawal",
    amount: "$3,200",
    status: "Processing",
    date: "March 8, 2026",
  },
  {
    id: "3",
    type: "Rebalance",
    amount: "—",
    status: "Processing",
    date: "March 9, 2026",
  },
  {
    id: "4",
    type: "Transfer",
    amount: "$1,500",
    status: "Completed",
    date: "March 5, 2026",
  },
  {
    id: "5",
    type: "Loan",
    amount: "$2,000",
    status: "Completed",
    date: "February 28, 2026",
  },
  {
    id: "6",
    type: "Withdrawal",
    amount: "$1,000",
    status: "Completed",
    date: "February 15, 2026",
  },
];

type FilterType = "All" | "Loans" | "Withdrawals" | "Transfers" | "Rebalance";

export function TransactionHistoryFiltered() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: FilterType[] = ["All", "Loans", "Withdrawals", "Transfers", "Rebalance"];

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Loans" && transaction.type === "Loan") ||
      (selectedFilter === "Withdrawals" && transaction.type === "Withdrawal") ||
      (selectedFilter === "Transfers" && transaction.type === "Transfer") ||
      (selectedFilter === "Rebalance" && transaction.type === "Rebalance");

    const matchesSearch =
      searchQuery === "" ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Action Required":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Transaction History
        </h2>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">
                    {transaction.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-900">{transaction.amount}</span>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusBadgeClass(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{transaction.date}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No transactions found</p>
          </div>
        )}
      </div>
    </Card>
  );
}
