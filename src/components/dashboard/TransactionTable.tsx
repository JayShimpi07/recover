import React from "react";
import { Transaction } from "@/lib/data/demoTransactions";
import { SimulationResult } from "@/lib/engine/simulation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function TransactionTable({ 
  transactions, 
  results,
  onRowClick 
}: { 
  transactions: Transaction[];
  results: SimulationResult[];
  onRowClick: (tx: Transaction) => void;
}) {
  return (
    <Card className="h-full bg-black/40 border-zinc-800 backdrop-blur-md flex flex-col">
      <div className="border-b border-white/5 p-4 flex justify-between items-center bg-black/20">
        <h3 className="font-semibold text-white">FAILED PAYMENTS</h3>
        <Badge variant="outline" className="text-zinc-400 font-normal">
          {transactions.length} Records
        </Badge>
      </div>
      
      <div className="flex-1 overflow-auto max-h-[600px] custom-scrollbar pb-4 pr-2">
        <table className="w-full min-w-[850px] text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-black/40 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
              <th className="px-6 py-3 font-medium">Failure</th>
              <th className="px-6 py-3 font-medium">Recovery Prob.</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const res = results.find(r => r.transaction.id === tx.id);
              const txData = res ? res.transaction : tx;
              
              return (
                <tr 
                  key={tx.id} 
                  onClick={() => onRowClick(txData)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-400 font-mono group-hover:text-white transition-colors">
                    {txData.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                    {txData.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-zinc-300">
                    {formatCurrency(txData.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-zinc-400 text-xs tracking-wider">
                      {txData.failure_type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {txData.recovery_probability ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/10 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${txData.recovery_probability >= 0.75 ? "bg-emerald-500" : txData.recovery_probability >= 0.5 ? "bg-amber-500" : "bg-red-500"}`} 
                            style={{ width: `${Math.round(txData.recovery_probability * 100)}%` }} 
                          />
                        </div>
                        <span className="text-xs text-zinc-400">{Math.round(txData.recovery_probability * 100)}%</span>
                      </div>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {txData.recommended_action ? (
                      <span className="text-xs font-medium text-zinc-300 tracking-wider">
                        {txData.recommended_action.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {txData.outcome === "RECOVERED" ? (
                      <Badge variant="success">Recovered</Badge>
                    ) : txData.outcome === "STOPPED" ? (
                      <Badge variant="destructive">Stopped</Badge>
                    ) : txData.outcome === "ESCALATED" ? (
                      <Badge variant="secondary" className="bg-amber-900/40 text-amber-300 hover:bg-amber-900/60">Escalated</Badge>
                    ) : (
                      <Badge variant="outline" className="text-zinc-500 border-zinc-700">Pending</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
