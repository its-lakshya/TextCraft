const SearchBar = () => {
  return (
    <div className='flex justify-between items-center w-full h-12 px-6'>
      <input
        placeholder="Search with email and add people"
        className="SEARCH h-full border border-gray-300 rounded-md px-4 text-sm focus:outline-primary" style={{width: 'calc(100% - 8rem)'}}
      ></input>
      <button type='submit' className='w-28 h-full bg-primary text-white rounded-md hover:bg-primaryDark'>Search</button>
    </div>
  );
};

export default SearchBar;
