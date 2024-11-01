'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuYoga from '@/components/Header/Menu/MenuYoga';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer';
import '../EventForm.css';
import axios from 'axios';
import { usePathname, useSearchParams } from 'next/navigation';

const EventForm = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // Assuming the ID is passed as a query param
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('Default Author'); // Default author setting
    const [category, setCategory] = useState('Event'); // Default category setting
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/event/${id}`)
                .then(response => {
                    const event = response.data;
                    setTitle(event.title);
                    setContent(event.content);
                    setAuthor(event.author);
                    setCategory(event.category);
                })
                .catch(error => {
                    console.error('Error fetching event:', error);
                });
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append(
            'board',
            new Blob([JSON.stringify({ title, content, author, category })], { type: 'application/json' })
        );
        if (image) {
            formData.append('image', image);
        }

        const apiCall = id ? axios.put : axios.post;
        const url = id ? `/api/event/${id}` : '/api/event';

        apiCall(url, formData)
            .then(() => {
                window.location.href = '/event/EventListPage'; // Navigating after the form is submitted
            })
            .catch(error => {
                console.error('Error saving event:', error);
            });
    };

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuYoga/>
                <Breadcrumb heading="Event" subHeading="Event" />
            </div>
            <div className="contact-us md:py-20 py-10">
                <div className="container">
                    <div className="flex justify-center max-lg:flex-col gap-y-10">
                        <div className="left lg:w-2/3 lg:pr-4">
                            <div className="heading2 flex justify-center md:py-10">이벤트 작성 페이지</div>
                            <form className="md:mt-6 mt-4" onSubmit={handleSubmit}>
                                <div className="Ev-form-container">
                                    <div className="Ev-form">
                                        <label className="Ev-form-label">제목:</label>
                                        <input
                                            className="border-line px-4 py-3 w-full rounded-lg"
                                            value={title}
                                            type="text"
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="Ev-form">
                                        <label className="Ev-form-label">작성자:</label>
                                        <input
                                            className="border-line px-4 py-3 w-full rounded-lg"
                                            value={author}
                                            type="text"
                                            onChange={(e) => setAuthor(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="Ev-form">
                                        <label className="Ev-form-label">카테고리:</label>
                                        <input
                                            className="border-line px-4 py-3 w-full rounded-lg"
                                            value={category}
                                            type="text"
                                            placeholder="카테고리"
                                            required
                                        />
                                    </div>
                                    <div className="Ev-form">
                                        <label className="Ev-form-label">이미지 업로드:</label>
                                        <input
                                            className="border-line px-4 py-3 w-full rounded-lg"
                                            id="imagepath"
                                            type="file"
                                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                    <div className="Ev-form">
                                        <label className="Ev-form-label">내용:</label>
                                        <textarea
                                            className="border-line px-4 py-3 w-full rounded-lg"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="block-button md:mt-6 mt-4">
                                        <button className="Event-button" type="submit">
                                            {id ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EventForm;
