"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLeadStore } from '@/store/leadStore';
import { ChevronLeft, ChevronRight, Loader2, Search, User, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Lead } from '../types/types';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const LeadsDashboard: React.FC = () => {
  const {
    leads,
    currentPage,
    totalPages,
    limit,
    loading,
    error,
    fetchLeads,
    setCurrentPage,
    setLimit,
  } = useLeadStore();

  const router = useRouter();
  const isReady = useAuthRedirect('/login');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'' | 'PENDING' | 'REACHED_OUT'>('');

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      if (limit !== 5) {
        setLimit(5);
      }
      isInitialMount.current = false;
    }
  }, [setLimit, limit]);

  useEffect(() => {
    if (isReady) {
        fetchLeads(currentPage, limit);
    }
  }, [fetchLeads, currentPage, limit, isReady]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);


  if (!isReady) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="ml-4 text-gray-600">Checking authentication...</p>
        </div>
    );
  }

  const filteredAndSearchedLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' ||
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300
            ${currentPage === 1 ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={loading || currentPage === 1}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="dots-start" className="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium border text-black  ${
            currentPage === i ? 'border-gray-700' : ' border-none'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={loading}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="dots-end" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            currentPage === totalPages ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={loading || currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center text-red-600">
          <p className="text-xl font-semibold mb-3">Error Loading Leads:</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => fetchLeads()}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <RefreshCw size={20} className="mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans sidebar-complex-gradient">
      <aside className="w-64 shadow-md p-6 flex flex-col justify-between">

        <div>
          <div className="text-gray-900 text-xl font-bold mb-8">alm&agrave;</div>
          <nav className="space-y-2">
            <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200">
                <span>Public Form</span>
            </Link>
            <Link href="/leads" className="flex items-center space-x-3 p-3 rounded-lg text-gray-900 font-semibold">
                <span>Leads</span>
            </Link>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200">
                <span>Settings</span>
            </a>
          </nav>
        </div>
        <div className="mt-auto border-t pt-4">
            <div className="flex items-center space-x-3 p-3">
                <div className="rounded-full bg-gray-200 p-2">
                    <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                    <p className="text-gray-900 font-semibold">Admin</p>
                </div>
            </div>
        </div>

        <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/login');
            }}
            className="text-sm text-red-600 hover:underline cursor-pointer"
          >
            Logout
          </button>
       
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Leads</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-75 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-black"
              />
            </div>
            <div className="relative w-full sm:w-auto text-black">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as '' | 'PENDING' | 'REACHED_OUT')}
                className="w-full min-w-45 pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-black focus:border-black bg-white"
              >
                <option value="">Status</option>
                <option value="PENDING">Pending</option>
                <option value="REACHED_OUT">Reached Out</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>


        {loading && leads.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-md">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Loading leads...</p>
          </div>
        ) : filteredAndSearchedLeads.length === 0 && !loading ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No leads found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                    <span className="ml-1 text-gray-400">↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                    <span className="ml-1 text-gray-400">↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                    <span className="ml-1 text-gray-400">↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                    <span className="ml-1 text-gray-400">↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSearchedLeads.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.submissionDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        lead.status === 'PENDING' ? 'text-yellow-700' : 'text-green-700'
                      }`}>
                        {lead.status === 'PENDING' ? 'Pending' : 'Reached Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lead.visasOfInterest.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <a href={lead.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-end items-center w-full">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
                className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md bg-white text-sm font-medium text-gray-500  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {renderPaginationNumbers()}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-r-md  bg-white text-sm font-medium text-gray-500  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeadsDashboard;