export const mockData = {
  user: {
    name: "Mark",
    avatar: "/placeholder.svg?height=40&width=40",
    activeBranches: 2,
  },
  kpis: {
    totalBookings: 150,
    revenue: 5000,
    roomsAvailable: 10,
    pendingRequests: 5,
  },
  bookings: [
    { room: "301", guest: "John Doe", checkIn: "12 PM" },
    { room: "205", guest: "Jane Smith", checkIn: "2 PM" },
    { room: "102", guest: "Alice Johnson", checkIn: "3 PM" },
  ],
  upcomingCheckIns: [
    { room: "401", guest: "Bob Wilson", checkIn: "4 PM" },
    { room: "302", guest: "Carol Davis", checkIn: "5 PM" },
  ],
  pendingApprovals: [
    { room: "501", guest: "Eve Brown", checkIn: "Tomorrow, 1 PM" },
    { room: "202", guest: "Frank White", checkIn: "Tomorrow, 3 PM" },
  ],
  revenueData: [
    { date: "Mon", amount: 1000 },
    { date: "Tue", amount: 1200 },
    { date: "Wed", amount: 900 },
    { date: "Thu", amount: 1500 },
    { date: "Fri", amount: 2000 },
    { date: "Sat", amount: 2200 },
    { date: "Sun", amount: 1800 },
  ],
  occupancyData: [
    { status: "Occupied", value: 75 },
    { status: "Available", value: 25 },
  ],
  topPerformingRooms: [
    { room: "Deluxe Suite", bookings: 50 },
    { room: "Standard Double", bookings: 40 },
    { room: "Family Room", bookings: 30 },
    { room: "Single Room", bookings: 20 },
    { room: "Executive Suite", bookings: 10 },
  ],
  recentActivity: [
    { type: "booking", message: "New booking for Room 301" },
    { type: "cancellation", message: "Cancellation for Room 205" },
    { type: "inquiry", message: "New inquiry about Room 102" },
  ],
};
