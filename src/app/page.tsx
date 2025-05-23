import React, { useState } from "react";

const page = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const handleSearch = () => {};

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
     {filteredData.map((i) => (
      <li>
        <p>{i}</p>
      </li>
     ))}
     [filteredData.length === 0 && <p>No results found</p>]
    </div>
  );
};

export default page;
