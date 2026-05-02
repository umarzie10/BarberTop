import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toast } from "sonner";
import { Upload, Trash2, X, Image as ImageIcon, Video } from "lucide-react";

type Mode = "image" | "video" | "before_after";

export default function BarberPortfolioPage() {
  const { user } = useAuth();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [mode, setMode] = useState<Mode>("image");
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<any>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);

  const load = async (bid: string) => {
    const { data } = await supabase.from("barber_portfolio").select("*").eq("barber_id", bid).order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("barbers").select("id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setBarberId(data.id); load(data.id); }
    });
  }, [user]);

  const uploadFile = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
  };

  const handleUpload = async (file: File, caption: string = "") => {
    if (!user || !barberId) return;
    setUploading(true);
    try {
      if (mode === "before_after") {
        if (!beforeFile) { setUploading(false); return toast.error("Avval 'oldin' rasmini tanlang"); }
        const before = await uploadFile(beforeFile);
        const after = await uploadFile(file);
        await supabase.from("barber_portfolio").insert({ barber_id: barberId, image_url: after, before_url: before, after_url: after, media_type: "before_after", caption });
        setBeforeFile(null);
      } else {
        const url = await uploadFile(file);
        await supabase.from("barber_portfolio").insert({ barber_id: barberId, image_url: url, media_type: mode, caption });
      }
      toast.success("Yuklandi");
      load(barberId);
    } catch (e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    await supabase.from("barber_portfolio").delete().eq("id", id);
    load(barberId!);
  };

  if (!barberId) return <div className="p-6"><Empty text="Avval profilingizni to'ldiring" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Portfolio" subtitle="Ishlaringizni Instagram-style galereyada ko'rsating" />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {(["image", "video", "before_after"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 text-xs rounded-md ${mode === m ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {m === "image" ? "Rasm" : m === "video" ? "Video" : "Oldin / Keyin"}
            </button>
          ))}
        </div>

        {mode === "before_after" ? (
          <div className="flex flex-wrap gap-2 items-center">
            <label className="px-3 py-2 text-xs bg-secondary rounded-md cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> {beforeFile ? `Oldin: ${beforeFile.name}` : "1. Oldin rasmini tanlang"}
              <input type="file" accept="image/*" hidden onChange={(e) => setBeforeFile(e.target.files?.[0] || null)} />
            </label>
            <label className={`px-3 py-2 text-xs rounded-md flex items-center gap-1.5 ${beforeFile ? "bg-primary text-primary-foreground cursor-pointer" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
              <Upload className="w-3.5 h-3.5" /> 2. Keyin rasmini yuklang
              <input type="file" accept="image/*" hidden disabled={!beforeFile} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>
          </div>
        ) : (
          <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> {uploading ? "..." : `${mode === "video" ? "Video" : "Rasm"} yuklash`}
            <input type="file" accept={mode === "video" ? "video/*" : "image/*"} hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </label>
        )}
      </Card>

      {!items.length ? <Empty text="Hali ish qo'shilmagan" /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {items.map((p) => (
            <div key={p.id} className="relative group aspect-square rounded-md overflow-hidden bg-muted cursor-pointer" onClick={() => setLightbox(p)}>
              {p.media_type === "video" ? (
                <video src={p.image_url} className="w-full h-full object-cover" />
              ) : p.media_type === "before_after" && p.before_url && p.after_url ? (
                <div className="grid grid-cols-2 w-full h-full">
                  <img src={p.before_url} alt="oldin" className="w-full h-full object-cover" />
                  <img src={p.after_url} alt="keyin" className="w-full h-full object-cover" />
                </div>
              ) : (
                <img src={p.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              )}
              <div className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] bg-black/60 text-white rounded flex items-center gap-1">
                {p.media_type === "video" ? <Video className="w-3 h-3" /> : p.media_type === "before_after" ? "B/A" : <ImageIcon className="w-3 h-3" />}
              </div>
              <button onClick={(e) => { e.stopPropagation(); del(p.id); }} className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white p-2"><X className="w-6 h-6" /></button>
          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {lightbox.media_type === "video" ? (
              <video src={lightbox.image_url} controls className="max-h-[80vh] rounded-lg" />
            ) : lightbox.media_type === "before_after" ? (
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-white text-xs mb-1">Oldin</p><img src={lightbox.before_url} className="rounded-lg max-h-[70vh]" /></div>
                <div><p className="text-white text-xs mb-1">Keyin</p><img src={lightbox.after_url} className="rounded-lg max-h-[70vh]" /></div>
              </div>
            ) : (
              <img src={lightbox.image_url} className="rounded-lg max-h-[80vh]" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
