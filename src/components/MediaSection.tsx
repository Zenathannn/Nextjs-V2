import Image from 'next/image'

export default function MediaSection() {
    return (
        <section className="mt-8 space-y-8">
            {/*judul section*/}
            <h3 className="text-2xl font-bold">Galeri Media Responsive</h3>

            {/*Single image dengan next/image*/}
            <div className="space-y-4">
                <h4 className="text-2xl font-semibold">Gambar Optimasi Otomatis</h4>
                <Image
                    src="/image.png"
                    alt="Gambar optimasi otomatis"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-xl"
                /> 
                <p className='text-gray-600 text-sm'>
                    Gambar ini ototmatis di lazy load, di konversi jadiwebP, dan ukurannya di optimasi sesuai kebutuhan layar pengguna.
                </p>
            </div>

            {/*Grid gambar 2 : Di mobile bertumpuk */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Gambar Responsive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Image
                        src="/image.png"
                        alt="Gambar pertama"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-xl"
                    />
                    <Image
                        src="/images2.png"
                        alt="Gambar kedua"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-xl"
                    />
                    </div>
            </div>

            {/*Vidio responsive youtube*/}
            <div className="space-y-4">
                <h4 className='text-xl font-semibold'>Vidio Responsive Youtube</h4>
                <div className='aspect-video w-full'>
                    <iframe
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Vidio Youtube Responsive"
                        allowFullScreen
                        className='w-full h-full rounded-lg shadow-xl'></iframe>
                </div>
                <p className='text-gray-600 text-sm'>Video selalu menjaga rasio 16:9 dan responsive di semua ukuran layar</p>
                </div>

                {/*Video lokal opsional*/}
                <div className='space-y-4'>
                    <h4 className='text-xl font-semibold'>Video Lokal (Opsional)</h4>
                    <video
                    src="/sample-video.mp4"
                    controls
                    className='w-full h-auto rounded-lg shadow-xl'></video>
                    </div>
                    <p className='text-gray-600 text-sm'>Video lokal juga bisa responsive dengan cara yang sama</p>
        </section>
    )
}