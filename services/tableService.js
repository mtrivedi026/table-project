exports.getTableData = ({ filterStatus, filterRole, search, sortBy, order, page, limit }) => {
  const data = [
     { id: 1,  name: "Mohit",   role: "Developer", status: "Active"   },
    { id: 2,  name: "Rahul",   role: "Designer",  status: "Inactive" },
    { id: 3,  name: "Aman",    role: "Developer", status: "Active"   },
    { id: 4,  name: "Neha",    role: "Manager",   status: "Inactive" },
    { id: 5,  name: "Riya",    role: "Designer",  status: "Active"   },
    { id: 6,  name: "Priya",   role: "Manager",   status: "Active"   },
    { id: 7,  name: "Vivek",   role: "Developer", status: "Inactive" },
    { id: 8,  name: "Sneha",   role: "Designer",  status: "Active"   },
    { id: 9,  name: "Arjun",   role: "Developer", status: "Active"   },
    { id: 10, name: "Pooja",   role: "Manager",   status: "Inactive" },
    { id: 11, name: "Rohit",   role: "Designer",  status: "Active"   },
    { id: 12, name: "Anjali",  role: "Developer", status: "Active"   },
    { id: 13, name: "Karan",   role: "Manager",   status: "Inactive" },
    { id: 14, name: "Divya",   role: "Designer",  status: "Active"   },
    { id: 15, name: "Suresh",  role: "Developer", status: "Inactive" },
    { id: 16, name: "Meena",   role: "Manager",   status: "Active"   },
    { id: 17, name: "Tarun",   role: "Designer",  status: "Active"   },
    { id: 18, name: "Kavya",   role: "Developer", status: "Inactive" },
    { id: 19, name: "Nikhil",  role: "Manager",   status: "Active"   },
    { id: 20, name: "Simran",  role: "Designer",  status: "Active"   },
  ];

  let result = [...data];

  // ✅ Status Filter
  if (filterStatus) {
    result = result.filter(item =>
      item.status.toLowerCase() === filterStatus.toLowerCase()
    );
  }

  // ✅ Role Filter
  if (filterRole) {
    result = result.filter(item =>
      item.role.toLowerCase() === filterRole.toLowerCase()
    );
  }

  // ✅ Search
  if (search) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // ✅ Sort
  if (sortBy) {
    result.sort((a, b) => {
      if (order === "desc") return a[sortBy] > b[sortBy] ? -1 : 1;
      return a[sortBy] > b[sortBy] ? 1 : -1;
    });
  }

  // ✅ Total after filter
  const total = result.length;

  // ✅ Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const start = (pageNum - 1) * limitNum;
  result = result.slice(start, start + limitNum);

  return { data: result, total };
};