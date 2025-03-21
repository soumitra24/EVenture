const Header = () => {
    return (
      <nav className="w-full flex justify-between items-center px-[2rem] py-[1.25rem] absolute top-0">
        <h1 className="text-[1.25rem] font-bold">Positivus</h1>
        <div className="flex space-x-[1.5rem]">
          <a href="#">About us</a>
          <a href="#services">Services</a>
          <a href="#case-studies">Use Cases</a>
          <a href="#">Pricing</a>
          <a href="#">Blog</a>
        </div>
        <button className="border px-[1.5rem] py-[0.75rem] rounded-md">Request a quote</button>
      </nav>
    );
  };
  
  export default Header;
  