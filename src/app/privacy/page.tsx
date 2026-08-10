import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Lock, Eye, Database, Share2, UserCheck, Mail, Bell, Trash2, RefreshCw } from 'lucide-react';

const PRIVACY_SECTIONS = [
  {
    id: 'collect',
    icon: Database,
    title: '1. Thông Tin Chúng Tôi Thu Thập',
    items: [
      {
        sub: 'Thông tin tài khoản',
        desc: 'Họ tên, địa chỉ email, số điện thoại, mật khẩu đã được mã hóa khi bạn đăng ký.',
      },
      {
        sub: 'Thông tin giao dịch',
        desc: 'Lịch sử đặt sân, thông tin thanh toán (không lưu số thẻ đầy đủ), và chi tiết hóa đơn.',
      },
      {
        sub: 'Dữ liệu sử dụng',
        desc: 'Địa chỉ IP, loại trình duyệt, các trang bạn xem, thời gian truy cập và thao tác trên ứng dụng.',
      },
      {
        sub: 'Vị trí',
        desc: 'Vị trí địa lý tương đối (tỉnh/thành phố) để gợi ý sân gần bạn nếu bạn đồng ý cung cấp.',
      },
    ],
  },
  {
    id: 'use',
    icon: Eye,
    title: '2. Cách Chúng Tôi Sử Dụng Thông Tin',
    items: [
      { sub: 'Cung cấp dịch vụ', desc: 'Xử lý đặt sân, gửi xác nhận và thông báo liên quan đến dịch vụ.' },
      { sub: 'Cải thiện trải nghiệm', desc: 'Phân tích hành vi sử dụng để cải thiện tính năng và giao diện.' },
      { sub: 'Hỗ trợ khách hàng', desc: 'Giải quyết vấn đề và hỗ trợ khi bạn liên hệ với chúng tôi.' },
      { sub: 'Marketing', desc: 'Gửi thông tin khuyến mãi, ưu đãi (bạn có thể từ chối bất kỳ lúc nào).' },
    ],
  },
  {
    id: 'share',
    icon: Share2,
    title: '3. Chia Sẻ Thông Tin',
    items: [
      { sub: 'Chủ sân', desc: 'Thông tin đặt lịch cần thiết (tên, SĐT) được chia sẻ với chủ sân bạn đã đặt.' },
      { sub: 'Đối tác thanh toán', desc: 'Thông tin giao dịch được chuyển cho cổng thanh toán để xử lý.' },
      { sub: 'Yêu cầu pháp lý', desc: 'Chúng tôi có thể tiết lộ thông tin theo yêu cầu của cơ quan pháp luật.' },
      { sub: 'Không bán dữ liệu', desc: 'Chúng tôi KHÔNG bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba.' },
    ],
  },
  {
    id: 'security',
    icon: Lock,
    title: '4. Bảo Mật Thông Tin',
    items: [
      { sub: 'Mã hóa SSL/TLS', desc: 'Mọi dữ liệu truyền tải giữa trình duyệt và máy chủ đều được mã hóa.' },
      { sub: 'Mật khẩu bảo mật', desc: 'Mật khẩu được băm bằng thuật toán bcrypt, chúng tôi không thể đọc mật khẩu của bạn.' },
      { sub: 'Kiểm soát truy cập', desc: 'Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin người dùng.' },
      { sub: 'Sao lưu định kỳ', desc: 'Dữ liệu được sao lưu thường xuyên để đảm bảo an toàn và khôi phục khi cần.' },
    ],
  },
  {
    id: 'rights',
    icon: UserCheck,
    title: '5. Quyền Của Bạn',
    items: [
      { sub: 'Truy cập', desc: 'Bạn có quyền xem tất cả thông tin cá nhân chúng tôi lưu trữ về bạn.' },
      { sub: 'Chỉnh sửa', desc: 'Bạn có thể cập nhật hoặc sửa chữa thông tin không chính xác bất kỳ lúc nào.' },
      { sub: 'Xóa tài khoản', desc: 'Bạn có thể yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan.' },
      { sub: 'Từ chối marketing', desc: 'Hủy đăng ký nhận email marketing bất kỳ lúc nào qua cài đặt tài khoản.' },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-20 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Chính Sách Bảo Mật</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-blue-200">
          Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn
        </p>
        <p className="mt-2 text-xs text-blue-300">Cập nhật lần cuối: 01 tháng 08, 2026</p>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Cam kết bảo mật */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Lock, label: 'Mã hóa SSL' },
            { icon: Database, label: 'Dữ liệu an toàn' },
            { icon: Bell, label: 'Thông báo vi phạm' },
            { icon: Trash2, label: 'Quyền xóa dữ liệu' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Các mục chính sách */}
        <div className="space-y-10">
          {PRIVACY_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div
                    key={item.sub}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-sm font-semibold text-gray-900">{item.sub}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Cookies */}
        <section id="cookies" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-3 text-lg font-bold text-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            6. Cookie & Công Nghệ Theo Dõi
          </h2>
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-relaxed text-gray-600 shadow-sm">
            <p>
              Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự để cải thiện trải nghiệm
              của bạn. Cookie giúp chúng tôi ghi nhớ tùy chọn của bạn, phân tích lưu lượng truy cập
              và cá nhân hóa nội dung.
            </p>
            <p className="mt-3">
              Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt. Tuy nhiên, việc tắt cookie
              có thể ảnh hưởng đến một số tính năng của trang web.
            </p>
          </div>
        </section>

        {/* Liên hệ */}
        <div className="mt-14 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Mail className="mx-auto h-10 w-10 text-blue-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Câu hỏi về quyền riêng tư?</h3>
          <p className="mt-2 text-sm text-gray-500">
            Liên hệ Cán Bộ Bảo Vệ Dữ Liệu (DPO) của chúng tôi nếu bạn có thắc mắc.
          </p>
          <a
            href="mailto:privacy@chandenclub.vn"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            privacy@chandenclub.vn
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
