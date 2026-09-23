"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-canvas flex">
      <main className="p-8">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary">SMM Automation Dashboard</p>
        <div className="mt-4">
          <p>WASM + Python orchestration dashboard</p>
        </div>
      </main>
    </div>
  );
}