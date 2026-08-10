import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileText, Scale, UserCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Chấp Nhận Điều Khoản',
    content: [
      'Bằng cách truy cập và sử dụng dịch vụ ChanDenClub, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều Khoản Dịch Vụ này.',
      'Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.',
      'Chúng tôi có quyền thay đổi các điều khoản này bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang web.',
    ],
  },
  {
    id: 'services',
    title: '2. Mô Tả Dịch Vụ',
    content: [
      'ChanDenClub là nền tảng kết nối người chơi thể thao với các cơ sở sân bóng. Chúng tôi cung cấp dịch vụ đặt sân trực tuyến, tổ chức trận đấu ngẫu hứng và quản lý lịch chơi.',
      'Chúng tôi không phải là chủ sở hữu trực tiếp của các sân bóng được liệt kê trên nền tảng. Chúng tôi chỉ đóng vai trò là trung gian kết nối giữa người dùng và chủ sân.',
      'Chúng tôi có quyền thay đổi, tạm dừng hoặc ngừng cung cấp bất kỳ phần nào của dịch vụ mà không cần thông báo trước.',
    ],
  },
  {
    id: 'account',
    title: '3. Tài Khoản Người Dùng',
    content: [
      'Để sử dụng đầy đủ các tính năng của ChanDenClub, bạn cần tạo tài khoản. Bạn có trách nhiệm duy trì tính bảo mật của thông tin đăng nhập.',
      'Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản. Việc cung cấp thông tin sai lệch có thể dẫn đến việc tài khoản bị đình chỉ.',
      'Bạn không được phép chia sẻ tài khoản với người khác. Mỗi người dùng chỉ được phép có một tài khoản.',
    ],
  },
  {
    id: 'booking',
    title: '4. Đặt Sân & Thanh Toán',
    content: [
      'Khi bạn thực hiện đặt sân thành công, một hợp đồng được xác lập giữa bạn và chủ sân. ChanDenClub không chịu trách nhiệm về bất kỳ tranh chấp nào phát sinh.',
      'Thanh toán phải được thực hiện đầy đủ trước khi đặt sân được xác nhận. Chúng tôi chấp nhận nhiều phương thức thanh toán bao gồm thẻ ngân hàng và ví điện tử.',
      'Trong trường hợp hủy đặt sân, chính sách hoàn tiền sẽ được áp dụng theo quy định của từng chủ sân được hiển thị trên trang chi tiết sân.',
    ],
  },
  {
    id: 'prohibited',
    title: '5. Hành Vi Bị Cấm',
    content: [
      'Sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc không được ủy quyền nào.',
      'Thu thập, lưu trữ hoặc sử dụng thông tin cá nhân của người dùng khác mà không có sự đồng ý.',
      'Giả mạo danh tính, cung cấp thông tin sai lệch hoặc gian lận trong quá trình sử dụng dịch vụ.',
      'Phá hoại, tấn công hoặc cố gắng truy cập trái phép vào hệ thống của chúng tôi.',
    ],
  },
  {
    id: 'liability',
    title: '6. Giới Hạn Trách Nhiệm',
    content: [
      'ChanDenClub không chịu trách nhiệm về các thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.',
      'Trách nhiệm tổng thể của chúng tôi đối với bạn trong bất kỳ trường hợp nào không vượt quá số tiền bạn đã thanh toán cho chúng tôi trong 12 tháng trước đó.',
      'Chúng tôi không đảm bảo rằng dịch vụ sẽ không bị gián đoạn, lỗi hoặc virus.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 py-20 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Scale className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Điều Khoản Dịch Vụ</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-300">
          Cập nhật lần cuối: 01 tháng 08, 2026
        </p>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Quick summary */}
        <div className="mb-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-emerald-800">
            <FileText className="h-5 w-5" />
            Tóm tắt nhanh
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
              Bạn được quyền đặt sân và hủy đặt theo chính sách
            </div>
            <div className="flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
              Thông tin của bạn được bảo mật tuyệt đối
            </div>
            <div className="flex items-start gap-2 text-sm text-red-600">
              <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              Không được chia sẻ tài khoản với người khác
            </div>
            <div className="flex items-start gap-2 text-sm text-red-600">
              <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              Không được sử dụng dịch vụ cho mục đích bất hợp pháp
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.content.map((para, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    {para}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Thông tin liên hệ */}
        <div className="mt-14 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <UserCheck className="mx-auto h-10 w-10 text-emerald-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Câu hỏi về Điều Khoản?</h3>
          <p className="mt-2 text-sm text-gray-500">
            Nếu bạn có bất kỳ câu hỏi nào về Điều Khoản Dịch Vụ, vui lòng liên hệ với chúng tôi.
          </p>
          <a
            href="mailto:legal@chandenclub.vn"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            legal@chandenclub.vn
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
