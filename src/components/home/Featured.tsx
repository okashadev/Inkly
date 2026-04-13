import Card from "./Cards";

export default function Featured() {
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-10">Featured Editorials</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="Brutalist Revival"
            desc="Modern UI design shift"
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuBMAz0hXmq5Pfp6LCP0QkZBRmMUMBRxlnSTFezLv2TdNN_qFebqDiTICL30xC2yFg2vnpgUOM-bH8tfOZcr9PuHa9WqtdQvzgADPgcTBgmwpJ3E_ZWPen1doVBiXRbpu-SS5FBWx8WdKQZqtoqOZ5zlGp7oKYPWxYgYoUyk1CJmXX_98-1yA8fS4rM1LNoM-w2Iy50tDXSCBfEpV1BJBom34rueiiZCbFMxpxyE2F-J7na095ggjggrccaJfaBXnG8Lj5pxcHq0UX7o"
          />
          <Card
            title="Flow State"
            desc="Perfect writing setup"
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuDFe8LpndnYSP2FUS2IkTwxfZZcc9dwV1SN1scG17omND5F02a_GyMwwTwgydklPw_QULZRDGMa7sSMTdmOZbkHs7UC7K8kKVjsdbGBgjB4hKt0rLR7Y5Agjj1lcdce7OMqaEOzkwWG8tud9GAW8dHPDUTSAdevQLWWdnj_TXOzajI2LAyaC9CNy7zsw6NSBof8l46574IMdoqPTtX6HN9uOBWgfcadSzL0PNBMuqCV4QdDlAPNMEYE5o9u2UDIt_Q_8FHZRFk3cG5t"
          />
          <Card
            title="Decentralized Content"
            desc="Future of blogging"
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuBQPPnNQfbjAh7LmpKViGwHNVMMmewV6zzUG72IQJ7nOGWFU3lRWOCs9eR4snB3KnEoKm2CgCJYcGnjipYolMqGY8oR1_mBOOaZkyOd-xIpmvnK1774crMTq7XhNdtBqDCUZ83Sj8RpVCDQb5M1FGVNwbZoTqqmIUVl6jVOdBf00PNiuiKRlz0h42ehHQezE3ae2oJ6Gun9ozX-yT7D658tYRnDED5-AFmgq8-RbFhw057lNU9wI1x-zKchjd_NlbYX1d6h_vWrJucG"
          />
        </div>
      </div>
    </section>
  );
}