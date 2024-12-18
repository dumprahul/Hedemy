import React from 'react';

export default function StakeOpenModal() {
    
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button className="btn btn-primary" onClick={() => document.getElementById('my_modal_4').showModal()}>Stake Now</button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-3/4 max-w-5xl p-8">
          <h3 className="font-bold text-lg text-center mb-8 text-white">Welcome Course!</h3>
          <p className="py-2 text-xl text-white">Name of the Course: Hashgraph Explorer</p>
          <p className="py-2 text-xl text-white">Author of the Course: 0x62752de9CA838C71084d2B841Be1Aa71e45B4B7e</p>
          <p className="py-2 text-xl text-white">Course Fee: 50HBAR</p>
          <p className="py-2 text-xl text-white">Course Status: Approved by HedemyDAO</p>
          <div className="modal-action mt-8 flex justify-center">
            <form method="dialog" className="flex items-center space-x-6">
              <button className="btn btn-primary">Stake 50HBAR</button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
