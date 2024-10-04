import React from 'react';
import bannerImage from '../assets/im2.jpg';
import crd2 from '../assets/im4.jpg';
import crd3 from '../assets/im5.jpg';

const Banner = () => {
    return (
        <div className="flex justify-between items-start">
            <div className="flex-1 p-4 ">
                <h1 className="text-4xl text-orange-500 font-bold mb-4 text-neutral-950">Get Your book at your price</h1><br></br><br></br>
                <p className="mb-4 text-neutral-950">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nemo eum in maiores quidem, quo accusamus ipsa, corporis alias animi commodi officiis. Tempora exercitationem blanditiis laboriosam odit repellendus ducimus, harum praesentium?</p>
                <input type="text" placeholder="Type here" className="input input-bordered input-info w-full bg-teal-50 border-current" />

                <div className="flex justify-center">
                    <button className="btn btn-success mt-4 px-9 ">Success</button>
                    <div className="flex">
                        <img
                            src={crd3}
                            alt="Responsive Image"
                            className="w-full h-auto object-contain"
                            style={{ height: "42vh", marginRight: "20px", marginTop: "60px" }}
                        />
                        <img
                            src={crd2}
                            alt="Responsive Image"
                            className="w-full h-auto object-contain"
                            style={{ height: "42vh", marginTop: "60px" }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4 ">
                <img src={bannerImage} alt="Responsive Image" className="w-full h-auto object-contain" style={{ height: "30" }} />
            </div>
        </div>
    );
};

export default Banner;
