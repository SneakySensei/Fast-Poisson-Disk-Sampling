import React, { useRef, useState } from "react";
import { BasicPointCloud } from "features";

export default function Homepage() {
  const [pointCloudData, setPointCloudData] = useState({
    r: 10,
    k: 30,
    pointSize: 2,
  });

  const minDistInputRef = useRef<HTMLInputElement>(null);
  const iterationsInputRef = useRef<HTMLInputElement>(null);
  const pointSizeInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    const r = Number(minDistInputRef.current?.value);
    const k = Number(iterationsInputRef.current?.value);
    const pointSize = Number(pointSizeInputRef.current?.value);

    if (r < 1 || k < 1 || pointSize < 1)
      return alert("Values must be greater than 0");

    setPointCloudData({ r, k, pointSize });
  };

  return (
    <main className="min-h-screen grid place-items-center p-4 bg-slate-700">
      <h1 className="text-xl font-bold mb-6">
        Fast Poisson Disk Sampling in Arbitrary Dimensions
      </h1>
      <section className="mb-6 flex justify-center items-end gap-4 flex-wrap">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Min Distance</span>
          </label>
          <input
            type="number"
            min={1}
            className="input input-sm input-bordered"
            defaultValue={pointCloudData.r}
            ref={minDistInputRef}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Iterations</span>
          </label>
          <input
            type="number"
            min={1}
            className="input input-sm input-bordered"
            defaultValue={pointCloudData.k}
            ref={iterationsInputRef}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Point Size</span>
          </label>
          <input
            type="number"
            min={1}
            className="input input-sm input-bordered"
            defaultValue={pointCloudData.pointSize}
            ref={pointSizeInputRef}
          />
        </div>
        <button className="btn btn-accent btn-sm" onClick={handleClick}>
          Generate
        </button>
      </section>
      <BasicPointCloud
        iterations={pointCloudData.k}
        minRadius={pointCloudData.r}
        pointSize={pointCloudData.pointSize}
      />
    </main>
  );
}
