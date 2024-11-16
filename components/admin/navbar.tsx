import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function NavbarAdmin() {
  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <Image
          src={"/img/ligth-img.png"}
          alt="logo"
          width={100}
          height={300}
          className=""
        />
      </div>
      <div>
        <h2 className="text-3xl font-lilita">Sistema de Ranking</h2>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default NavbarAdmin;
