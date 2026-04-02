import Image from 'next/image';

const MediumRightbar = () => {
  return (
    <aside className="w-80 flex-shrink-0 hidden xl:block sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto pl-8 py-8 border-l border-gray-100">
      
      {/* Staff Picks */}
      <div className="mb-10">
         <h4 className="font-bold text-[15px] text-gray-900 mb-6">Staff Picks</h4>
         
         <div className="space-y-6">
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px]">🏢</div>
                  <span className="text-[13px] font-medium text-gray-900">TY CSE Department</span>
               </div>
               <h5 className="font-bold text-[15px] text-gray-900 leading-snug">The Future of AI in Computing Architectures</h5>
               <p className="text-[13px] text-gray-500">Mar 12</p>
            </div>
            
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">👨‍🏫</div>
                  <span className="text-[13px] font-medium text-gray-900">Prof. Sharma</span>
               </div>
               <h5 className="font-bold text-[15px] text-gray-900 leading-snug">How to write clean code directly in React Hooks</h5>
               <p className="text-[13px] text-gray-500">Feb 28</p>
            </div>
            
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-[10px]">👩‍💻</div>
                  <span className="text-[13px] font-medium text-gray-900">Shruti M.</span>
               </div>
               <h5 className="font-bold text-[15px] text-gray-900 leading-snug">Why Reading More Books Wasn't Making Me Smarter</h5>
               <p className="text-[13px] text-gray-500">Dec 11, 2025</p>
            </div>
         </div>
         
         <button className="text-gray-500 hover:text-gray-900 text-[13px] mt-6 transition-colors font-medium">See the full list</button>
      </div>
      
      {/* Recommended Topics */}
      <div className="mb-10">
         <h4 className="font-bold text-[15px] text-gray-900 mb-6">Recommended topics</h4>
         <div className="flex flex-wrap gap-2">
            {['Programming', 'Data Science', 'Machine Learning', 'React.js', 'System Design', 'Algorithms', 'JavaScript'].map((topic) => (
              <span key={topic} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 text-[13px] font-medium rounded-full cursor-pointer transition-colors">
                 {topic}
              </span>
            ))}
         </div>
      </div>

    </aside>
  );
};

export default MediumRightbar;
