/**
 * Gizlilik Politikası Sayfası
 * Google Play Store gereksinimi için gizlilik politikası
 */

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function PrivacyPolicyScreen() {
  const colors = useColors();

  return (
    <ScreenContainer>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.right" size={24} color={colors.foreground} style={{ transform: [{ rotate: "180deg" }] }} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.foreground,
          }}
        >
          Gizlilik Politikası
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: colors.muted,
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          Son Güncelleme: 15 Ocak 2026
        </Text>

        {/* Giriş */}
        <Section title="Giriş" colors={colors}>
          Ödeme Takibi uygulaması, kullanıcılarının gizliliğine saygı gösterir. Bu gizlilik politikası,
          uygulamamızın hangi verileri topladığını, nasıl kullandığını ve koruduğunu açıklar.
        </Section>

        {/* Veri Toplama */}
        <Section title="Veri Toplama" colors={colors}>
          Ödeme Takibi uygulaması <Text style={{ fontWeight: "bold" }}>hiçbir kişisel veri toplamaz</Text>.
          Tüm ödeme ve gelir bilgileriniz yalnızca cihazınızda yerel olarak saklanır ve hiçbir sunucuya
          gönderilmez.
        </Section>

        {/* Veri Saklama */}
        <Section title="Veri Saklama" colors={colors}>
          • Tüm veriler cihazınızın yerel depolama alanında (AsyncStorage) saklanır{"\n"}
          • Verileriniz yalnızca sizin erişiminize açıktır{"\n"}
          • Uygulama silindiğinde tüm veriler otomatik olarak silinir{"\n"}
          • Veri yedekleme özelliği ile verilerinizi dışa aktarabilirsiniz
        </Section>

        {/* Üçüncü Taraf Paylaşım */}
        <Section title="Üçüncü Taraf Paylaşım" colors={colors}>
          Ödeme Takibi uygulaması <Text style={{ fontWeight: "bold" }}>hiçbir veriyi üçüncü taraflarla paylaşmaz</Text>.
          Verileriniz yalnızca cihazınızda kalır ve internet üzerinden hiçbir yere gönderilmez.
        </Section>

        {/* Bildirimler */}
        <Section title="Bildirimler" colors={colors}>
          Uygulama, ödeme hatırlatıcıları için yerel bildirimler kullanır. Bu bildirimler yalnızca
          cihazınızda oluşturulur ve hiçbir sunucuya bilgi göndermez. Bildirimleri istediğiniz zaman
          ayarlardan kapatabilirsiniz.
        </Section>

        {/* İzinler */}
        <Section title="Uygulama İzinleri" colors={colors}>
          Ödeme Takibi uygulaması aşağıdaki izinleri kullanır:{"\n\n"}
          • <Text style={{ fontWeight: "bold" }}>Bildirimler</Text>: Ödeme hatırlatıcıları göndermek için{"\n"}
          • <Text style={{ fontWeight: "bold" }}>Depolama</Text>: Veri yedekleme dosyalarını kaydetmek için
        </Section>

        {/* Veri Güvenliği */}
        <Section title="Veri Güvenliği" colors={colors}>
          Verileriniz cihazınızın yerel depolama alanında güvenli bir şekilde saklanır. Cihazınızın
          güvenliğini sağlamak için ekran kilidi ve şifre kullanmanızı öneririz.
        </Section>

        {/* Çocukların Gizliliği */}
        <Section title="Çocukların Gizliliği" colors={colors}>
          Uygulamamız 13 yaşın altındaki çocuklardan bilerek veri toplamaz. Ebeveynler, çocuklarının
          uygulamayı kullanımını denetlemelidir.
        </Section>

        {/* Değişiklikler */}
        <Section title="Politika Değişiklikleri" colors={colors}>
          Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda
          uygulama içinde bildirim yapılacaktır.
        </Section>

        {/* İletişim */}
        <Section title="İletişim" colors={colors}>
          Gizlilik politikamız hakkında sorularınız varsa, lütfen bizimle iletişime geçin:{"\n\n"}
          E-posta: destek@odemetakibi.com
        </Section>

        {/* Footer */}
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
            textAlign: "center",
            marginTop: 32,
            lineHeight: 18,
          }}
        >
          Ödeme Takibi uygulamasını kullanarak bu gizlilik politikasını kabul etmiş olursunuz.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  colors: any;
}

function Section({ title, children, colors }: SectionProps) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: colors.foreground,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.foreground,
          lineHeight: 22,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
