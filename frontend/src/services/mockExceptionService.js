export const mockTransactions = [
  {
    id: "TXN-9081",
    customer: "Acme Corp Ltd",
    amount: 145000,
    risk: "HIGH",
    reason: "Unusual geographic location (Russia)",
    confidence: 94,
    status: "Pending"
  },
  {
    id: "TXN-9082",
    customer: "Rahul Kumar",
    amount: 95000,
    risk: "MEDIUM",
    reason: "Velocity check failed (3 txns in 5 mins)",
    confidence: 72,
    status: "Human Review Required"
  },
  {
    id: "TXN-9083",
    customer: "Jane Smith",
    amount: 450,
    risk: "LOW",
    reason: "Mismatch billing address",
    confidence: 89,
    status: "Auto Resolved"
  },
  {
    id: "TXN-9084",
    customer: "Global Tech LLC",
    amount: 2500000,
    risk: "HIGH",
    reason: "Exceeds daily transfer limit",
    confidence: 99,
    status: "Pending"
  },
  {
    id: "TXN-9085",
    customer: "Liam O'Connor",
    amount: 1250,
    risk: "LOW",
    reason: "New device login",
    confidence: 95,
    status: "Resolved"
  },
  {
    id: "TXN-9086",
    customer: "Nexus Trading",
    amount: 54000,
    risk: "MEDIUM",
    reason: "Suspicious merchant category",
    confidence: 65,
    status: "Human Review Required"
  }
];
