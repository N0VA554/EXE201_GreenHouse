import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MiniCarousel from '../../components/MiniCarousel';

interface BlogDetailData {
    title: string;
    content: string;
    imageUrl: string;
    createdTime: string;
    author?: { fullName?: string };
}

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<BlogDetailData | null>(null);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        fetch(`${apiUrl}/blogs/${id}`)
            .then(res => res.json())
            .then(res => setData(res.data));
    }, [id]);

    if (!data) return <div>Đang tải...</div>;

    return (
        <div style={{ background: '#f4faf6', padding: '0 0 40px 0' }}>
            <MiniCarousel />
            <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', padding: 32 }}>
                <div style={{ textAlign: 'center', padding: '40px 0 24px 0', background: '#eaf7ee' }}>
                    <h1 style={{ color: '#2e7d32', fontWeight: 700, fontSize: 36, margin: 0 }}>{data.title}</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '24px 0 16px 0', color: '#666', fontSize: 15 }}>
                    <span>{new Date(data.createdTime).toLocaleDateString()}</span>
                    <span>{data.author?.fullName}</span>
                </div>
                {data.imageUrl && (
                    <div style={{ textAlign: 'center', margin: '24px 0' }}>
                        <img src={data.imageUrl} alt={data.title} style={{ maxWidth: '100%', borderRadius: 8 }} />
                    </div>
                )}
                <div
                    style={{ fontSize: 18, color: '#222', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: data.content }}
                />
            </div>
        </div>
    );
};

export default BlogDetail;