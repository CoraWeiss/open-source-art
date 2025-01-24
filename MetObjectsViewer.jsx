import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Card, CardContent } from '@/components/ui/card';

const MetObjectsViewer = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await window.fs.readFile('MetObjects.csv', { encoding: 'utf8' });
        Papa.parse(response, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const startIndex = (page - 1) * itemsPerPage;
  const displayedData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="p-4">Loading Met Objects data...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Met Objects Collection</h2>
      <div className="space-y-4">
        {displayedData.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold">{item.Title || 'Untitled'}</h3>
              <div className="mt-2 space-y-1">
                <p><strong>Artist:</strong> {item.Artist || 'Unknown'}</p>
                <p><strong>Date:</strong> {item.Date || 'Unknown'}</p>
                <p><strong>Medium:</strong> {item.Medium || 'Not specified'}</p>
                {item.PrimaryImageURL && (
                  <img 
                    src={item.PrimaryImageURL} 
                    alt={item.Title}
                    className="mt-2 max-w-full h-auto rounded"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button 
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button 
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={startIndex + itemsPerPage >= data.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MetObjectsViewer;
