import React from 'react';
import Card from './Card';
import list from '../../public/list.json';
import { Link } from 'react-router-dom';

function Course() {
  return (
    <>
      <br /><br />
      <div className='max-w-screen-2xl container mx-auto md:px-20 px-4'>
        <div className='mt-27.5 flex flex-col items-center justify-center text-center'>
          <h1 className='text-2xl md:text-4xl'>We are delighted to have you Here</h1>
          <p className='mt-12'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, adipisci ducimus magnam vero ullam, doloremque dolorem eveniet voluptate ad qui animi corporis rem, quam soluta dicta molestiae itaque laudantium? In? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit porro provident tenetur quasi? Culpa soluta quas sint quaerat dolor pariatur officia praesentium? Alias harum quis itaque amet eum, est sit.
          </p>
          <Link to="/">
            <button className='mt-6 bg-pink-500 text-white px-8 py-2 rounded-md hover:bg-pink-700 duration-300'>Back</button>
          </Link>
        </div>
        <div className='mt-12 grid grid-cols-1 md:grid-cols-1'>
          {list.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Course;
