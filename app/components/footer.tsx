const Footer = () => {
    return (
        <footer className="w-full bg-[#191A23] text-white py-[2.5rem] px-[2rem] mt-[5rem] rounded-t-4xl max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-[1.5rem]">
          <h1 className="text-[1.25rem] font-bold">Positivus</h1>
          <div className="flex space-x-[1.5rem]">
            <a href="#">About us</a>
            <a href="#services">Services</a>
            <a href="#">Use Cases</a>
            <a href="#">Pricing</a>
            <a href="#">Blog</a>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#B9FF66] font-bold">Contact us:</p>
            <p>Email: info@positivus.com</p>
            <p>Phone: 555-567-8901</p>
            <p>Address: 1234 Main St, Moonstone City, Stardust State 12345</p>
          </div>
          <div className="bg-[#292A32] p-[1rem] rounded-lg ">
            <input type="email" placeholder="Email" className="p-[0.75rem] text-black rounded-md mr-[1rem]" />
            <button className="bg-[#B9FF66] text-black px-[1.5rem] py-[0.75rem] rounded-md">Subscribe to news</button>
          </div>
        </div>
        <hr className="my-[2rem] border-gray-500" />
        <div className="text-center text-gray-500">
          <p>© 2023 Positivus. All Rights Reserved. <a href="#" className="underline">Privacy Policy</a></p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  