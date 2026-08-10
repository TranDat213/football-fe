'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ChevronDown, Search, MessageCircle, Phone, Mail, BookOpen, Users, Calendar, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: 'Làm thế nào để đặt sân bóng?',
    answer: 'Bạn có thể đặt sân bằng cách tìm kiếm sân phù hợp trên trang chủ, chọn sân muốn đặt, chọn khung giờ phù hợp và tiến hành thanh toán. Quá trình đặt sân chỉ mất vài phút.',
  },
  {
    question: 'Tôi có thể hủy đặt sân không?',
    answer: 'Có, bạn có thể hủy đặt sân trước 24 giờ so với giờ chơi để được hoàn tiền đầy đủ. Nếu hủy trong vòng 24 giờ, phí hoàn tiền sẽ là 50% tổng giá trị đặt sân.',
  },
  {
    question: 'Thanh toán qua những phương thức nào?',
    answer: 'Chúng tôi hỗ trợ thanh toán qua thẻ ngân hàng (Visa, MasterCard), ví điện tử (MoMo, ZaloPay), chuyển khoản ngân hàng, và thanh toán tiền mặt tại sân.',
  },
  {
    question: 'Trận đấu ngẫu hứng là gì?',
    answer: 'Trận đấu ngẫu hứng cho phép bạn tạo hoặc tham gia các trận đấu bóng với người chơi khác mà không cần phải đặt toàn bộ sân. Bạn có thể tìm đối thủ hoặc đồng đội dễ dàng.',
  },
  {
    question: 'Làm sao để trở thành chủ sân trên nền tảng?',
    answer: 'Để đăng ký làm chủ sân, vui lòng liên hệ với chúng tôi qua email hoặc hotline. Đội ngũ hỗ trợ sẽ hướng dẫn bạn quy trình xác minh và đăng ký.',
  },
  {
    question: 'Thông tin cá nhân của tôi có được bảo mật không?',
    answer: 'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính Sách Bảo Mật nghiêm ngặt. Dữ liệu của bạn được mã hóa và không bao giờ được chia sẻ cho bên thứ ba.',
  },
];

const HELP_CATEGORIES = [
  { icon: BookOpen, title: 'Hướng dẫn đặt sân', description: 'Cách tìm kiếm, lọc và đặt sân nhanh chóng', href: '#booking-guide' },
  { icon: Users, title: 'Trận đấu ngẫu hứng', description: 'Tạo và tham gia trận đấu với người chơi khác', href: '#casual-matches' },
  { icon: Calendar, title: 'Quản lý đặt lịch', description: 'Xem, sửa hoặc hủy lịch đặt sân của bạn', href: '#manage-bookings' },
  { icon: CreditCard, title: 'Thanh toán & Hoàn tiền', description: 'Các phương thức thanh toán và chính sách hoàn tiền', href: '#payment' },
  { icon: Shield, title: 'Bảo mật tài khoản', description: 'Bảo vệ và quản lý tài khoản của bạn', href: '#security' },
  { icon: AlertCircle, title: 'Báo cáo sự cố', description: 'Gửi báo cáo khi gặp vấn đề trong quá trình sử dụng', href: '#report' },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-gray-600">{answer}</p>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState('');

  const filtered = FAQ_ITEMS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-20 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Trung Tâm Trợ Giúp</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-emerald-100">
          Tìm câu trả lời nhanh chóng cho mọi thắc mắc của bạn
        </p>
        <div className="mx-auto mt-8 flex max-w-lg items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Danh mục hỗ trợ */}
        {!search && (
          <section>
            <h2 className="text-xl font-bold text-gray-900">Chủ đề hỗ trợ</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HELP_CATEGORIES.map((cat) => (
                <a
                  key={cat.title}
                  href={cat.href}
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white px-6 shadow-sm">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <FAQItem key={item.question} question={item.question} answer={item.answer} />
              ))
            ) : (
              <p className="py-10 text-center text-sm text-gray-500">
                Không tìm thấy câu hỏi phù hợp. Vui lòng liên hệ hỗ trợ.
              </p>
            )}
          </div>
        </section>

        {/* Liên hệ */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-gray-900">Vẫn cần hỗ trợ?</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href="mailto:support@chandenclub.vn"
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Email hỗ trợ</h3>
              <p className="text-sm text-gray-500">support@chandenclub.vn</p>
              <span className="text-xs text-gray-400">Phản hồi trong 24 giờ</span>
            </a>
            <a
              href="tel:18001234"
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Hotline</h3>
              <p className="text-sm text-gray-500">1800 1234</p>
              <span className="text-xs text-gray-400">Thứ 2–6, 8:00–17:00</span>
            </a>
            <a
              href="#chat"
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500">Trò chuyện trực tiếp</p>
              <span className="text-xs text-gray-400">Phản hồi trong vài phút</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
