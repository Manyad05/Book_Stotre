import React from 'react';
import list from '../../public/list.json';

function Card() {
  const filterData = list.filter((data) => data.category === 'free');

  return (
    <>
      <div className='max-w-screen-2xl container mx-auto md:px-20 px-4 mt-10'>
        <h1 className='font-bold text-3xl pb-5 text-stone-950'>Free courses here</h1>
        <p className="mb-4 text-neutral-950 mt--4">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nemo eum in maiores quidem, quo accusamus ipsa,<br></br>
          corporis alias animi commodi officiis.<br></br>
          Tempora exercitationem blanditiis laboriosam odit repellendus ducimus, harum praesentium?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filterData.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden shadow-lg border border-gray-200 relative">
              <img className="w-full h-32 object-cover object-center" src={item.image} alt={item.name} />
              <div className="p-2">
                <h2 className="text-base font-bold mb-1">{item.name}</h2>
                <p className="text-sm text-gray-700 mb-1">{item.title}</p>
                <p className="text-sm text-green-600 font-bold">{item.price === 0 ? 'Free' : `$${item.price}`}</p>
                <div className='ml-10 badge badge-outline hover:bg-pink-800 hover:text-white px-3 py-4 duration-200 rounded-lg text-lg cursor-pointer'>Buy now</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Card;
