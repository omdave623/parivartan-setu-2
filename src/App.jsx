import { useEffect, useState } from "react";
import {
  Recycle,
  Truck,
  Cpu,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
  User,
  TrendingUp,
  LogOut,
  Plus,
  Trash2,
  Eye,
  Filter,
  ShieldCheck,
  Leaf,
  Smartphone,
  Package,
  BarChart3,
  Layers,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  XCircle,
  Info,
  Menu,
  X,
  MapPin,
  Scale,
  FileText,
  Sparkles,
  Check,
  Zap,
  Boxes,
  Activity,
  Handshake,
  Search,
  Image as ImageIcon,
  Tv,
  Monitor,
  LayoutDashboard,
  ShieldAlert,
  ArrowUpRight,
  Factory,
  Ban,
  PackagePlus,
  UserCheck,
  AlertTriangle,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Plug
} from "lucide-react";
import "./App.css";

/* =====================================================
   FLOATING LEAF PARTICLES ANIMATION COMPONENT
   ===================================================== */

function FloatingLeaves() {
  return (
    <div className="floating-leaves-container" aria-hidden="true">
      <div className="floating-leaf leaf-1"><Leaf /></div>
      <div className="floating-leaf leaf-2"><Leaf /></div>
      <div className="floating-leaf leaf-3"><Leaf /></div>
      <div className="floating-leaf leaf-4"><Leaf /></div>
      <div className="floating-leaf leaf-5"><Leaf /></div>
    </div>
  );
}

/* =====================================================
   MAIN APP COMPONENT (Preserving all logic & persistence)
   ===================================================== */

function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("kabadiwala_role") || "Collector";
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("kabadiwala_loggedIn") === "true";
  });

  const [page, setPage] = useState("dashboard");

  const defaultRequests = [
    {
      id: "EW-001",
      item: "Old Laptop",
      location: "Ahmedabad",
      weight: "4.5 kg",
      collector: "Rajesh Kumar",
      recycler: "GreenCycle",
      status: "Pending",
      expectedPrice: 900,
      offeredPrice: null,
      images: [],
      rejectionReason: "",
      source: "Scrap Vendor",
      notes: "Intel i5, 8GB RAM, working motherboard."
    },
    {
      id: "EW-002",
      item: "Mobile Phones",
      location: "Ahmedabad",
      weight: "2.2 kg",
      collector: "Amit Patel",
      recycler: "EcoTech",
      status: "Processing",
      expectedPrice: 450,
      offeredPrice: 425,
      images: [],
      rejectionReason: "",
      source: "Residential Collection",
      notes: "Assorted smartphones, missing batteries."
    },
    {
      id: "EW-003",
      item: "Desktop Computer",
      location: "Ahmedabad",
      weight: "8.7 kg",
      collector: "Suresh Shah",
      recycler: "GreenCycle",
      status: "Recycled",
      expectedPrice: 1800,
      offeredPrice: 1750,
      images: [],
      rejectionReason: "",
      source: "Corporate Office",
      notes: "Complete tower chassis with power supply."
    },
  ];

  const [requests, setRequests] = useState(() => {
    const savedRequests = localStorage.getItem("kabadiwala_requests");
    return savedRequests ? JSON.parse(savedRequests) : defaultRequests;
  });

  useEffect(() => {
    localStorage.setItem("kabadiwala_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("kabadiwala_role", role);
  }, [role]);

  const [form, setForm] = useState({
    item: "Laptop",
    weight: "",
    location: "",
    source: "",
    expectedPrice: "",
    notes: "",
    images: [],
  });

  const updateStatus = (id, status) => {
    setRequests((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const updateOfferPrice = (id, price) => {
    setRequests((current) =>
      current.map((item) =>
        item.id === id ? { ...item, offeredPrice: price } : item
      )
    );
  };

  const rejectRequest = (id, reason) => {
    setRequests((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Rejected",
              rejectionReason: reason,
            }
          : item
      )
    );
  };

  const logout = () => {
    localStorage.removeItem("kabadiwala_loggedIn");
    localStorage.removeItem("kabadiwala_role");
    setLoggedIn(false);
    setRole("Collector");
    setPage("dashboard");
  };

  const handleLogin = () => {
    localStorage.setItem("kabadiwala_loggedIn", "true");
    localStorage.setItem("kabadiwala_role", role);
    setLoggedIn(true);
  };

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert("Only JPG, JPEG and PNG images are allowed.");
    }

    const validTypeFiles = files.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const oversizedFiles = validTypeFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      alert("Each image must be less than 5 MB.");
    }

    const validFiles = validTypeFiles.filter(
      (file) => file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    const readers = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((imageData) => {
      setForm((current) => ({
        ...current,
        images: [...current.images, ...imageData],
      }));
    });

    e.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  /* ================= ADD COLLECTION ================= */

  const addCollection = (e) => {
    e.preventDefault();

    if (
      !form.weight ||
      !form.location ||
      !form.source ||
      !form.expectedPrice
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newCollection = {
      id: `EW-${String(requests.length + 1).padStart(3, "0")}`,
      item: form.item,
      location: form.location,
      weight: `${form.weight} kg`,
      expectedPrice: Number(form.expectedPrice),
      offeredPrice: null,
      collector: "Current Collector",
      recycler: "Pending Assignment",
      status: "Pending",
      images: form.images,
      source: form.source,
      notes: form.notes,
      rejectionReason: "",
    };

    setRequests((current) => [newCollection, ...current]);

    setForm({
      item: "Laptop",
      weight: "",
      location: "",
      source: "",
      expectedPrice: "",
      notes: "",
      images: [],
    });

    setPage("collections");
  };

  /* =====================================================
     UNAUTHENTICATED LANDING / LOGIN SCREEN
     ===================================================== */

  if (!loggedIn) {
    return (
      <div className="login-container">
        {/* Floating animated leaf graphics */}
        <FloatingLeaves />

        {/* Left Branding & Illustration Hero */}
        <div className="login-hero">
          <div className="login-hero-bg-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>

          <div className="hero-content">
            <div className="brand-logo-pill glow-pulse">
              <Recycle className="brand-icon spin-slow" />
              <span>Parivartan Setu • परिवर्तन सेतु</span>
            </div>

            <h1 className="hero-title">
              Bridging <span className="highlight-text">Informal Collectors</span> with Formal Recyclers
            </h1>

            <p className="hero-description">
              Digital e-waste management platform with visual navigation designed for transparent circular economy, fair valuation, and 100% compliant e-waste lifecycle tracking.
            </p>

            {/* Custom SVG Illustration */}
            <div className="hero-illustration-wrapper">
              <HeroIllustration />
            </div>

            {/* Value Highlights with pictorial symbols */}
            <div className="hero-badges">
              <div className="badge-item">
                <ShieldCheck className="badge-icon text-green" />
                <span>Verified Recyclers (प्रमाणित)</span>
              </div>
              <div className="badge-item">
                <TrendingUp className="badge-icon text-amber" />
                <span>Fair Rates (सही मूल्य)</span>
              </div>
              <div className="badge-item">
                <Leaf className="badge-icon text-emerald" />
                <span>Eco Recycling (पर्यावरण सुरक्षा)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="login-form-wrapper">
          <div className="login-card">
            <div className="login-header">
              <div className="mobile-brand">
                <Recycle className="icon" />
                <span>Parivartan Setu</span>
              </div>
              <h2>Select Portal Access</h2>
              <p>Choose your role using the visual symbols below</p>
            </div>

            {/* Visual Role Switcher Cards */}
            <div className="role-selector-grid">
              {[
                {
                  name: "Collector",
                  icon: Boxes,
                  badgeBg: "collector-theme",
                  title: "Collector",
                  sub: "संग्रहकर्ता / 📦",
                  emoji: "📦"
                },
                {
                  name: "Recycler",
                  icon: Factory,
                  badgeBg: "recycler-theme",
                  title: "Recycler",
                  sub: "पुनर्चक्रणकर्ता / 🏭",
                  emoji: "🏭"
                },
                {
                  name: "Admin",
                  icon: ShieldCheck,
                  badgeBg: "admin-theme",
                  title: "Admin",
                  sub: "प्रबंधक / 🛡️",
                  emoji: "🛡️"
                },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = role === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`role-card-btn ${item.badgeBg} ${isSelected ? "selected" : ""}`}
                    onClick={() => setRole(item.name)}
                  >
                    <div className="role-emoji-avatar">
                      <IconComponent className="role-icon-lg" />
                      <span className="role-emoji-overlay">{item.emoji}</span>
                    </div>
                    <div className="role-card-text">
                      <strong>{item.title}</strong>
                      <small>{item.sub}</small>
                    </div>
                    {isSelected && <Check className="selected-check" />}
                  </button>
                );
              })}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address / यूजर आईडी</label>
                <div className="input-with-icon">
                  <User className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="input"
                    placeholder={`enter.${role.toLowerCase()}@parivartansetu.org`}
                    defaultValue={`${role.toLowerCase()}@parivartansetu.org`}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password / पासवर्ड</label>
                <div className="input-with-icon">
                  <FileText className="input-icon" />
                  <input
                    id="login-password"
                    type="password"
                    className="input"
                    placeholder="••••••••••••"
                    defaultValue="password123"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="primary-btn login-submit-btn ripple-btn"
              >
                <div className="btn-content">
                  <span>Enter {role} Workspace</span>
                  <ArrowRight className="btn-icon" />
                </div>
              </button>
            </form>

            <div className="prototype-badge">
              <Sparkles className="sparkle-icon" />
              <span>Prototype Mode • One-Click Login</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     COLLECTOR - COLLECTIONS PAGE
     ===================================================== */

  if (role === "Collector" && page === "collections") {
    return (
      <Layout role={role} page={page} setPage={setPage} logout={logout}>
        <PageHeader
          title="My E-Waste Collections"
          subtitle="View collection lots, check recycler offers, and track status"
          role={role}
        />

        <div className="content-card">
          <div className="section-header">
            <div>
              <h2>Collection Requests Queue</h2>
              <p>Active items registered for recycler quotes</p>
            </div>

            <button
              className="primary-btn flex-center-btn pulse-ring-btn"
              onClick={() => setPage("add-collection")}
            >
              <PackagePlus className="btn-icon-lg" />
              <span>➕ Add New Collection</span>
            </button>
          </div>

          <div className="request-list">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                role={role}
                updateStatus={updateStatus}
                rejectRequest={rejectRequest}
                updateOfferPrice={updateOfferPrice}
              />
            ))}
          </div>

          {requests.length === 0 && (
            <EmptyState
              title="No Collection Requests Created"
              message="Tap the green '+ Add New Collection' button above to register your first e-waste item."
              actionText="➕ Add New Collection"
              onAction={() => setPage("add-collection")}
            />
          )}
        </div>
      </Layout>
    );
  }

  /* =====================================================
     COLLECTOR - ADD COLLECTION FORM
     ===================================================== */

  if (role === "Collector" && page === "add-collection") {
    return (
      <Layout role={role} page={page} setPage={setPage} logout={logout}>
        <PageHeader
          title="Add New Collection Lot"
          subtitle="Select material category, weight, photos, and expected price"
          role={role}
        />

        <div className="content-card form-card">
          <div className="card-header-block">
            <div className="icon-avatar-bg collector-accent">
              <PackagePlus className="avatar-icon" />
            </div>
            <div>
              <h2>Collection Information • सामग्री विवरण</h2>
              <p className="card-subtitle">
                Select category and upload clear photos for instant recycler offers.
              </p>
            </div>
          </div>

          {/* Visual Category Picker Buttons */}
          <div className="category-visual-picker">
            <label className="picker-label">1. Choose E-Waste Category / सामान का प्रकार चुनें *</label>
            <div className="category-grid">
              {[
                { name: "Laptop", icon: Cpu, label: "Laptop", hindi: "लैपटॉप 💻", color: "blue" },
                { name: "Mobile Phones", icon: Smartphone, label: "Mobile / Tablet", hindi: "मोबाइल 📱", color: "emerald" },
                { name: "Desktop Computer", icon: Monitor, label: "Desktop PC", hindi: "कंप्यूटर 🖥️", color: "indigo" },
                { name: "Television", icon: Tv, label: "TV / Monitor", hindi: "टीवी 📺", color: "amber" },
                { name: "Other", icon: Plug, label: "Other Scrap", hindi: "अन्य इलेक्ट्रॉनिक 🔌", color: "purple" },
              ].map((cat) => {
                const IconComp = cat.icon;
                const isCatSelected = form.item === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    className={`category-card-btn color-${cat.color} ${isCatSelected ? "selected" : ""}`}
                    onClick={() => setForm((curr) => ({ ...curr, item: cat.name }))}
                  >
                    <IconComp className="cat-icon" />
                    <strong>{cat.label}</strong>
                    <small>{cat.hindi}</small>
                    {isCatSelected && <Check className="cat-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={addCollection}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="weight-input">2. Weight (kg) / कुल वजन (किलो) *</label>
                <div className="input-with-icon">
                  <Scale className="input-icon text-green" />
                  <input
                    id="weight-input"
                    type="number"
                    step="0.1"
                    min="0"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. 4.5"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location-input">3. City / Area / शहर या क्षेत्र *</label>
                <div className="input-with-icon">
                  <MapPin className="input-icon text-amber" />
                  <input
                    id="location-input"
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. Ahmedabad"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="source-input">4. Collection Source / स्रोत *</label>
                <div className="input-with-icon">
                  <Building2 className="input-icon text-blue" />
                  <input
                    id="source-input"
                    type="text"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. Local scrap shop / House"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="price-input">5. Expected Price (₹) / अपेक्षित मूल्य *</label>
                <div className="input-with-icon">
                  <DollarSign className="input-icon text-emerald" />
                  <input
                    id="price-input"
                    type="number"
                    step="1"
                    min="0"
                    name="expectedPrice"
                    value={form.expectedPrice}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. 900"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes-textarea">Notes & Specifications / अतिरिक्त विवरण</label>
              <textarea
                id="notes-textarea"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="input textarea"
                placeholder="Include condition details, working status, model numbers, or special instructions..."
                rows="3"
              />
            </div>

            {/* ================= IMAGES ================= */}

            <div className="form-group">
              <label>6. Upload Material Photos / फोटो अपलोड करें</label>

              <div className="dropzone-box glow-hover">
                <ImageIcon className="dropzone-icon text-green bounce-anim" />
                <div className="dropzone-text">
                  <strong>Click to select images</strong> or drag photos here
                  <p className="upload-hint">
                    JPG, JPEG or PNG formats supported. Max size 5 MB per image.
                  </p>
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  multiple
                  onChange={handleImageChange}
                  className="file-overlay-input"
                />
              </div>

              {form.images.length > 0 && (
                <div className="image-preview-grid">
                  {form.images.map((image, index) => (
                    <div className="image-preview-item" key={index}>
                      <img
                        src={image}
                        alt={`E-waste upload ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="icon-sm" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setPage("collections")}
              >
                Cancel
              </button>

              <button type="submit" className="primary-btn flex-center-btn pulse-ring-btn">
                <Check className="btn-icon" />
                <span>Submit Collection Lot (जमा करें)</span>
              </button>
            </div>
          </form>
        </div>
      </Layout>
    );
  }

  /* =====================================================
     RECYCLER - INCOMING E-WASTE
     ===================================================== */

  if (role === "Recycler" && page === "ewaste") {
    const incomingRequests = requests.filter(
      (request) => request.status === "Pending" || request.status === "Accepted"
    );

    return (
      <Layout role={role} page={page} setPage={setPage} logout={logout}>
        <PageHeader
          title="Incoming E-Waste Auctions"
          subtitle="Review collector listings, propose offers, and accept material"
          role={role}
        />

        <div className="content-card">
          <div className="section-header">
            <div>
              <h2>Incoming Request Queue</h2>
              <p>Review material details and submit your purchasing quote</p>
            </div>
            <div className="badge-count-pill recycler-pill">
              <Clock className="icon-sm" />
              <span>{incomingRequests.length} Active Listings</span>
            </div>
          </div>

          <div className="request-list">
            {incomingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                role={role}
                updateStatus={updateStatus}
                rejectRequest={rejectRequest}
                updateOfferPrice={updateOfferPrice}
              />
            ))}
          </div>

          {incomingRequests.length === 0 && (
            <EmptyState
              title="No Incoming E-Waste Pending"
              message="There are no pending collection requests waiting for quotes right now."
            />
          )}
        </div>
      </Layout>
    );
  }

  /* =====================================================
     RECYCLER - PROCESSING WORKFLOW
     ===================================================== */

  if (role === "Recycler" && page === "processing") {
    const processingRequests = requests.filter(
      (request) =>
        request.status === "Received" ||
        request.status === "Processing" ||
        request.status === "Recycled"
    );

    return (
      <Layout role={role} page={page} setPage={setPage} logout={logout}>
        <PageHeader
          title="Recycling Processing Pipeline"
          subtitle="Track materials from plant receipt to component recycling"
          role={role}
        />

        <div className="content-card">
          <div className="section-header">
            <div>
              <h2>Active Recycling Facility Batches</h2>
              <p>Update material status as processing advances through plant milestones</p>
            </div>
            <div className="badge-count-pill accent">
              <Activity className="icon-sm" />
              <span>{processingRequests.length} Batches</span>
            </div>
          </div>

          <div className="request-list">
            {processingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                role={role}
                updateStatus={updateStatus}
                rejectRequest={rejectRequest}
                updateOfferPrice={updateOfferPrice}
              />
            ))}
          </div>

          {processingRequests.length === 0 && (
            <EmptyState
              title="No Processing Records"
              message="No e-waste material is currently undergoing recycling in your facility."
            />
          )}
        </div>
      </Layout>
    );
  }

  /* =====================================================
     ADMIN - TRACKING LIFECYCLE
     ===================================================== */

  if (role === "Admin" && page === "tracking") {
    return (
      <Layout role={role} page={page} setPage={setPage} logout={logout}>
        <PageHeader
          title="E-Waste Lifecycle Tracking"
          subtitle="Audit trail of e-waste lots across all ecosystem partners"
          role={role}
        />

        <div className="content-card">
          <div className="section-header">
            <div>
              <h2>End-to-End Recycling Journey</h2>
              <p>Visual 5-stage lifecycle monitoring with status indicators</p>
            </div>
            <button className="secondary-btn flex-center-btn" onClick={() => setPage("dashboard")}>
              <LayoutDashboard className="btn-icon" />
              <span>Back to Overview</span>
            </button>
          </div>

          <div className="tracking-list">
            {requests.map((request) => (
              <div className="tracking-card" key={request.id}>
                <div className="tracking-header">
                  <div className="tracking-title-block">
                    <div className="item-icon-avatar">
                      {getItemIcon(request.item)}
                    </div>
                    <div>
                      <h3>{request.item}</h3>
                      <div className="meta-pills">
                        <span className="id-tag">{request.id}</span>
                        <span className="meta-text"><MapPin className="icon-xs" /> {request.location}</span>
                        <span className="meta-text"><Scale className="icon-xs" /> {request.weight}</span>
                        <span className="meta-text"><User className="icon-xs" /> {request.collector}</span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                {request.images && request.images.length > 0 && (
                  <div className="request-images">
                    {request.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${request.item} thumbnail ${index + 1}`}
                        className="request-image"
                      />
                    ))}
                  </div>
                )}

                {/* REJECTION BANNER */}
                {request.status === "Rejected" && (
                  <div className="rejection-box visual-rejection-card">
                    <div className="rejection-badge-header">
                      <Ban className="rejection-icon-lg" />
                      <div>
                        <strong className="rejection-title">⛔ REJECTED / अस्वीकृत</strong>
                        <p className="rejection-subtext">This e-waste lot was declined by the recycler.</p>
                      </div>
                    </div>
                    <div className="rejection-reason-content">
                      <strong>Reason given:</strong> {request.rejectionReason || "Specification mismatch / unsafe material."}
                    </div>
                  </div>
                )}

                {/* Progress Visualizer Component */}
                <TrackingTimeline status={request.status} />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  /* =====================================================
     ADMIN DASHBOARD OVERVIEW
     ===================================================== */

  if (role === "Admin") {
    const totalWeight = requests.reduce(
      (total, item) => total + (parseFloat(item.weight) || 0),
      0
    );

    const pending = requests.filter((item) => item.status === "Pending").length;
    const accepted = requests.filter((item) => item.status === "Accepted").length;
    const processing = requests.filter((item) => item.status === "Processing" || item.status === "Received").length;
    const recycled = requests.filter((item) => item.status === "Recycled").length;
    const rejected = requests.filter((item) => item.status === "Rejected").length;

    const totalValuation = requests.reduce(
      (total, item) => total + (Number(item.offeredPrice || item.expectedPrice) || 0),
      0
    );

    return (
      <Layout role={role} page={page} setPage={setPage} logout={logout}>
        <PageHeader
          title="Admin Control Center"
          subtitle="System-wide e-waste metrics, collector activity, and recycler performance"
          role={role}
        />

        <div className="stats-grid">
          <StatCard
            icon={Boxes}
            number={requests.length}
            label="Total Lots Registered"
            subtext="📦 Total Collections"
            accent="primary"
          />
          <StatCard
            icon={Scale}
            number={`${totalWeight.toFixed(1)} kg`}
            label="Total E-Waste Weight"
            subtext="⚖ Material Volume"
            accent="emerald"
          />
          <StatCard
            icon={Activity}
            number={pending + processing}
            label="Active Operations"
            subtext="⚙ Active Pipelines"
            accent="amber"
          />
          <StatCard
            icon={CheckCircle2}
            number={recycled}
            label="Fully Recycled"
            subtext="♻ Zero-Landfill Completed"
            accent="teal"
          />
        </div>

        {/* Status Distribution Bar */}
        <div className="content-card">
          <div className="section-header">
            <div>
              <h2>E-Waste Ecosystem Status Distribution</h2>
              <p>Visual status distribution breakdown across all lots</p>
            </div>
            <div className="price-tag-pill">
              <DollarSign className="icon-sm" />
              <span>Total Material Valuation: ₹{totalValuation.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="distribution-bar-container">
            <div className="distribution-bar">
              <div
                className="dist-segment pending"
                style={{ width: `${(pending / requests.length) * 100}%` }}
                title={`Pending: ${pending}`}
              ></div>
              <div
                className="dist-segment accepted"
                style={{ width: `${(accepted / requests.length) * 100}%` }}
                title={`Accepted: ${accepted}`}
              ></div>
              <div
                className="dist-segment processing"
                style={{ width: `${(processing / requests.length) * 100}%` }}
                title={`Processing: ${processing}`}
              ></div>
              <div
                className="dist-segment recycled"
                style={{ width: `${(recycled / requests.length) * 100}%` }}
                title={`Recycled: ${recycled}`}
              ></div>
              <div
                className="dist-segment rejected"
                style={{ width: `${(rejected / requests.length) * 100}%` }}
                title={`Rejected: ${rejected}`}
              ></div>
            </div>

            <div className="distribution-legend">
              <div className="legend-item"><span className="dot pending"></span> ⏳ Pending ({pending})</div>
              <div className="legend-item"><span className="dot accepted"></span> 🤝 Accepted ({accepted})</div>
              <div className="legend-item"><span className="dot processing"></span> ⚙ Processing ({processing})</div>
              <div className="legend-item"><span className="dot recycled"></span> ♻ Recycled ({recycled})</div>
              <div className="legend-item"><span className="dot rejected"></span> ❌ Rejected ({rejected})</div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="section-header">
            <div>
              <h2>Recent Collection Activity</h2>
              <p>Audit table of all recorded e-waste lots</p>
            </div>

            <button
              className="primary-btn flex-center-btn"
              onClick={() => setPage("tracking")}
            >
              <Eye className="btn-icon" />
              <span>View Interactive Lifecycle</span>
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>E-Waste Item</th>
                  <th>Collector</th>
                  <th>Recycler</th>
                  <th>Weight</th>
                  <th>Valuation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <span className="id-badge">{request.id}</span>
                    </td>
                    <td>
                      <div className="table-item-cell">
                        {getItemIcon(request.item)}
                        <span>{request.item}</span>
                      </div>
                    </td>
                    <td>{request.collector}</td>
                    <td>{request.recycler}</td>
                    <td><strong>{request.weight}</strong></td>
                    <td>₹{Number(request.offeredPrice || request.expectedPrice || 0).toLocaleString("en-IN")}</td>
                    <td>
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    );
  }

  /* =====================================================
     DEFAULT DASHBOARD (Collector / General)
     ===================================================== */

  const totalWeight = requests.reduce(
    (total, item) => total + (parseFloat(item.weight) || 0),
    0
  );
  const recycledCount = requests.filter((item) => item.status === "Recycled").length;

  return (
    <Layout role={role} page="dashboard" setPage={setPage} logout={logout}>
      <PageHeader
        title="Dashboard Overview"
        subtitle={`Welcome back, ${role} • Track collections and recycler pricing`}
        role={role}
      />

      <div className="stats-grid">
        <StatCard
          icon={Boxes}
          number={requests.length}
          label="Total Collection Lots"
          subtext="📦 Collections"
          accent="primary"
        />
        <StatCard
          icon={CheckCircle2}
          number={recycledCount}
          label="Completed Recycles"
          subtext="♻ Recycled"
          accent="emerald"
        />
        <StatCard
          icon={Scale}
          number={`${totalWeight.toFixed(1)} kg`}
          label="E-Waste Weight"
          subtext="⚖ Total Weight"
          accent="teal"
        />
        <StatCard
          icon={Handshake}
          number={requests.filter((i) => i.status === "Pending" || i.status === "Accepted").length}
          label="Active Deals"
          subtext="🤝 Quotes in Progress"
          accent="amber"
        />
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <h2>Recent E-Waste Collections</h2>
            <p>Latest requests registered across the platform</p>
          </div>
          {role === "Collector" && (
            <button
              className="primary-btn flex-center-btn pulse-ring-btn"
              onClick={() => setPage("add-collection")}
            >
              <PackagePlus className="btn-icon-lg" />
              <span>➕ Add New Collection</span>
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Location</th>
                <th>Weight</th>
                <th>Expected Valuation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <span className="id-badge">{request.id}</span>
                  </td>
                  <td>
                    <div className="table-item-cell">
                      {getItemIcon(request.item)}
                      <span>{request.item}</span>
                    </div>
                  </td>
                  <td>{request.location}</td>
                  <td><strong>{request.weight}</strong></td>
                  <td>₹{Number(request.expectedPrice || 0).toLocaleString("en-IN")}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

/* =====================================================
   HELPER GRAPHIC COMPONENTS WITH COLORFUL PICTORIAL BADGES
   ===================================================== */

function getItemIcon(item) {
  const lower = (item || "").toLowerCase();
  if (lower.includes("laptop")) {
    return (
      <div className="item-visual-avatar blue">
        <Cpu className="cell-icon" />
        <span>💻</span>
      </div>
    );
  }
  if (lower.includes("mobile") || lower.includes("phone")) {
    return (
      <div className="item-visual-avatar emerald">
        <Smartphone className="cell-icon" />
        <span>📱</span>
      </div>
    );
  }
  if (lower.includes("desktop") || lower.includes("computer")) {
    return (
      <div className="item-visual-avatar indigo">
        <Monitor className="cell-icon" />
        <span>🖥️</span>
      </div>
    );
  }
  if (lower.includes("tv") || lower.includes("television")) {
    return (
      <div className="item-visual-avatar amber">
        <Tv className="cell-icon" />
        <span>📺</span>
      </div>
    );
  }
  return (
    <div className="item-visual-avatar purple">
      <Plug className="cell-icon" />
      <span>🔌</span>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg className="hero-svg" viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="320" rx="20" fill="url(#hero-bg-grad)" />
      <defs>
        <linearGradient id="hero-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#022c22" />
          <stop offset="50%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Decorative Circuit Lines */}
      <path d="M 60 160 H 160 L 210 210 H 320" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
      <path d="M 120 70 V 120 L 170 170 H 290 L 340 120 V 60" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
      <path d="M 400 240 H 320 L 270 190 H 180" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
      
      {/* Circuit Nodes */}
      <circle cx="60" cy="160" r="5" fill="#10b981" />
      <circle cx="210" cy="210" r="5" fill="#34d399" />
      <circle cx="320" cy="210" r="5" fill="#059669" />
      <circle cx="120" cy="70" r="4" fill="#10b981" />
      <circle cx="340" cy="60" r="4" fill="#a7f3d0" />

      {/* Central Circular Economy Hub */}
      <circle cx="250" cy="160" r="70" fill="#064e3b" stroke="#34d399" strokeWidth="3" />
      <circle cx="250" cy="160" r="50" fill="#022c22" stroke="#10b981" strokeWidth="2" />
      
      {/* Center Icon Symbol (Recycle / Eco Leaf) */}
      <path d="M 235 150 C 235 140, 245 130, 255 135 C 265 140, 270 155, 260 170 C 250 180, 235 175, 235 150 Z" fill="#10b981" />
      <path d="M 265 170 C 265 180, 255 190, 245 185 C 235 180, 230 165, 240 150 C 250 140, 265 145, 265 170 Z" fill="#34d399" opacity="0.8" />
      <path d="M 240 165 Q 250 155 260 160" stroke="#022c22" strokeWidth="2" strokeLinecap="round" />

      {/* Satellite Nodes */}
      <g transform="translate(100, 100)">
        <rect width="44" height="34" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
        <rect x="8" y="6" width="28" height="18" rx="2" fill="#022c22" />
        <line x1="6" y1="28" x2="38" y2="28" stroke="#34d399" strokeWidth="2" />
      </g>

      <g transform="translate(350, 100)">
        <rect width="24" height="42" rx="5" fill="#064e3b" stroke="#6ee7b7" strokeWidth="1.5" />
        <rect x="3" y="4" width="18" height="30" rx="2" fill="#022c22" />
        <circle cx="12" cy="38" r="1.5" fill="#6ee7b7" />
      </g>

      <g transform="translate(228, 240)">
        <rect width="44" height="36" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
        <path d="M 10 18 L 22 8 L 34 18 H 28 V 28 H 16 V 18 Z" fill="#34d399" />
      </g>
    </svg>
  );
}

/* =====================================================
   LAYOUT COMPONENT WITH PROMINENT MOBILE LOGOUT
   ===================================================== */

function Layout({ role, page, setPage, logout, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleBadgeConfig = {
    Collector: { title: "Collector Portal", emoji: "📦", icon: Boxes, styleClass: "collector-pill" },
    Recycler: { title: "Recycler Portal", emoji: "🏭", icon: Factory, styleClass: "recycler-pill" },
    Admin: { title: "Admin Portal", emoji: "🛡️", icon: ShieldCheck, styleClass: "admin-pill" },
  };

  const currentRoleConfig = roleBadgeConfig[role] || roleBadgeConfig.Collector;
  const RoleIcon = currentRoleConfig.icon;

  return (
    <div className="dashboard-layout">
      {/* Floating leaves effect in main background */}
      <FloatingLeaves />

      {/* Mobile Top Header Bar with DIRECT LOGOUT BUTTON */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <Recycle className="brand-icon spin-slow" />
          <span>Parivartan Setu</span>
        </div>

        <div className="mobile-right-actions">
          <span className={`role-pill-sm ${currentRoleConfig.styleClass}`}>
            {currentRoleConfig.emoji} {role}
          </span>
          
          {/* Direct Mobile Logout Button */}
          <button
            className="mobile-logout-btn"
            onClick={logout}
            title="Sign Out"
            aria-label="Logout"
          >
            <LogOut className="icon-sm" />
            <span>Logout</span>
          </button>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon-box glow-pulse">
            <Recycle className="brand-svg spin-slow" />
          </div>
          <div className="brand-text">
            <strong>Parivartan</strong>
            <small>Setu Portal • सेतु</small>
          </div>
        </div>

        {/* Visual Role Indicator Card in Sidebar */}
        <div className={`sidebar-role-indicator ${currentRoleConfig.styleClass}`}>
          <div className="indicator-avatar">
            <RoleIcon className="indicator-icon" />
            <span className="indicator-emoji">{currentRoleConfig.emoji}</span>
          </div>
          <div className="indicator-text">
            <strong>{currentRoleConfig.title}</strong>
            <small>Logged in Active Mode</small>
          </div>
        </div>

        <nav className="menu-list">
          <button
            className={`nav-item ${page === "dashboard" ? "active" : ""}`}
            onClick={() => { setPage("dashboard"); setMobileMenuOpen(false); }}
          >
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard (होम)</span>
          </button>

          {role === "Collector" && (
            <>
              <button
                className={`nav-item ${page === "collections" ? "active" : ""}`}
                onClick={() => { setPage("collections"); setMobileMenuOpen(false); }}
              >
                <Boxes className="nav-icon text-green" />
                <span>My Collections (📦 संग्रह)</span>
              </button>

              <button
                className={`nav-item highlight-nav ${page === "add-collection" ? "active" : ""}`}
                onClick={() => { setPage("add-collection"); setMobileMenuOpen(false); }}
              >
                <PackagePlus className="nav-icon text-emerald" />
                <span>➕ Add Collection (नया जोड़ें)</span>
              </button>
            </>
          )}

          {role === "Recycler" && (
            <>
              <button
                className={`nav-item ${page === "ewaste" ? "active" : ""}`}
                onClick={() => { setPage("ewaste"); setMobileMenuOpen(false); }}
              >
                <Recycle className="nav-icon text-blue" />
                <span>Incoming E-Waste (🏭 लिस्टिंग)</span>
              </button>

              <button
                className={`nav-item ${page === "processing" ? "active" : ""}`}
                onClick={() => { setPage("processing"); setMobileMenuOpen(false); }}
              >
                <Activity className="nav-icon text-purple" />
                <span>Processing Pipeline (⚙️ रीसाइक्लिंग)</span>
              </button>
            </>
          )}

          {role === "Admin" && (
            <>
              <button
                className={`nav-item ${page === "tracking" ? "active" : ""}`}
                onClick={() => { setPage("tracking"); setMobileMenuOpen(false); }}
              >
                <Truck className="nav-icon text-amber" />
                <span>E-Waste Tracking (🔎 ट्रैकिंग)</span>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="avatar">{role.charAt(0)}</div>
            <div className="profile-info">
              <strong>{role} Account</strong>
              <small>Verified Prototype</small>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <LogOut className="logout-icon" />
            <span>Sign Out (लॉग आउट)</span>
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

/* =====================================================
   PAGE HEADER
   ===================================================== */

function PageHeader({ title, subtitle, role }) {
  const roleEmojiMap = {
    Collector: "📦 Collector",
    Recycler: "🏭 Recycler",
    Admin: "🛡️ Admin",
  };

  return (
    <div className="topbar">
      <div>
        <div className="breadcrumb-pill glow-hover">
          <Leaf className="leaf-icon text-green spin-slow-hover" />
          <span>{roleEmojiMap[role] || role} Workspace</span>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="user-badge">
        <div className="avatar">{role.charAt(0)}</div>
        <div>
          <strong>{role} Portal</strong>
          <small className="online-pill">
            <span className="online-dot"></span> Live Prototype
          </small>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   STAT CARD
   ===================================================== */

function StatCard({ icon: IconComponent, number, label, subtext, accent = "primary" }) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <IconComponent className="stat-icon" />
        </div>
        <span className="stat-badge-pill">{subtext}</span>
      </div>

      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* =====================================================
   STATUS BADGE WITH GRADIENT STYLING
   ===================================================== */

function StatusBadge({ status }) {
  let className = "status pending";
  let IconComponent = Clock;
  let symbolText = "⏳ Pending";

  if (status === "Recycled") {
    className = "status completed";
    IconComponent = CheckCircle2;
    symbolText = "♻️ Recycled";
  } else if (status === "Processing" || status === "Received") {
    className = "status processing";
    IconComponent = Activity;
    symbolText = "⚙️ Processing";
  } else if (status === "Accepted") {
    className = "status accepted";
    IconComponent = Handshake;
    symbolText = "🤝 Offer Agreed";
  } else if (status === "Rejected") {
    className = "status rejected";
    IconComponent = XCircle;
    symbolText = "❌ Rejected";
  }

  return (
    <span className={className}>
      <IconComponent className="status-icon" />
      <span>{symbolText}</span>
    </span>
  );
}

/* =====================================================
   REQUEST CARD WITH DEDICATED RECYCLER OPERATIONAL TIMELINE
   ===================================================== */

function RequestCard({
  request,
  role,
  updateStatus,
  rejectRequest,
  updateOfferPrice,
}) {
  const [offerPrice, setOfferPrice] = useState(request.offeredPrice ?? "");

  const handleReject = () => {
    const reason = window.prompt(
      "Why are you rejecting this e-waste request?\n\nExample: Material specifications mismatch / Moisture damage / Weight discrepancy"
    );

    if (reason === null || reason.trim() === "") return;
    rejectRequest(request.id, reason.trim());
  };

  return (
    <div className="request-card glow-card-hover">
      <div className="request-info">
        <div className="request-title-row">
          <div className="item-title-badge">
            {getItemIcon(request.item)}
            <h3>{request.item}</h3>
          </div>
          <span className="id-tag">{request.id}</span>
        </div>

        {request.images && request.images.length > 0 && (
          <div className="request-images">
            {request.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${request.item} photo ${index + 1}`}
                className="request-image zoom-on-hover"
              />
            ))}
          </div>
        )}

        <div className="request-details">
          <span>
            <MapPin className="detail-icon text-amber" /> {request.location}
          </span>
          <span>
            <Scale className="detail-icon text-green" /> {request.weight}
          </span>
          <span>
            <User className="detail-icon text-blue" /> Collector: <strong>{request.collector}</strong>
          </span>
          <span>
            <Factory className="detail-icon text-purple" /> Recycler: <strong>{request.recycler}</strong>
          </span>
        </div>

        {/* PRICING COMPARISON BOX */}
        <div className="price-comparison-box visual-price-box">
          <div className="price-item">
            <span className="price-label">💰 Collector Expected Price</span>
            <strong className="price-value">
              ₹{Number(request.expectedPrice || 0).toLocaleString("en-IN")}
            </strong>
          </div>
          <div className="price-divider"></div>
          <div className="price-item">
            <span className="price-label">🤝 Recycler Offer Quote</span>
            <strong className={`price-value ${request.offeredPrice ? "offered" : "pending"}`}>
              {request.offeredPrice
                ? `₹${Number(request.offeredPrice).toLocaleString("en-IN")}`
                : "⏳ Awaiting Quote"}
            </strong>
          </div>
        </div>

        {/* RECYCLER-SPECIFIC OPERATIONAL TIMELINE GRAPHIC */}
        {role === "Recycler" && (
          <RecyclerOperationalTimeline status={request.status} />
        )}

        {/* HIGH IMPACT VISUAL REJECTION BANNER */}
        {request.status === "Rejected" && (
          <div className="rejection-box visual-rejection-card">
            <div className="rejection-badge-header">
              <Ban className="rejection-icon-lg text-red" />
              <div>
                <strong className="rejection-title">⛔ REJECTED / निरस्त</strong>
                <p className="rejection-subtext">This request was declined by the recycler.</p>
              </div>
            </div>
            <div className="rejection-reason-content">
              <strong>Reason:</strong> {request.rejectionReason || "Material does not match requirements."}
            </div>
          </div>
        )}
      </div>

      <div className="request-actions">
        <StatusBadge status={request.status} />

        {/* COLLECTOR VIEW */}
        {role === "Collector" && request.status === "Accepted" && (
          <div className="collector-accepted-pill glow-pulse">
            <CheckCircle2 className="icon-sm" />
            <span>🤝 Offer Agreed</span>
          </div>
        )}

        {/* RECYCLER - PENDING OFFER */}
        {role === "Recycler" && request.status === "Pending" && (
          <div className="recycler-actions price-actions">
            <div className="input-with-icon price-input-wrap">
              <DollarSign className="input-icon text-green" />
              <input
                type="number"
                min="0"
                step="1"
                className="input price-input"
                placeholder="Offer Price ₹"
                value={offerPrice}
                onChange={(e) => {
                  setOfferPrice(e.target.value);
                  updateOfferPrice(
                    request.id,
                    e.target.value === "" ? null : Number(e.target.value)
                  );
                }}
              />
            </div>

            <button
              type="button"
              className="primary-btn small flex-center-btn pulse-ring-btn"
              onClick={() => {
                const numericOffer = Number(offerPrice);
                if (!offerPrice || !Number.isFinite(numericOffer) || numericOffer < 0) {
                  alert("Please enter a valid offer price before accepting.");
                  return;
                }
                updateOfferPrice(request.id, numericOffer);
                updateStatus(request.id, "Accepted");
              }}
            >
              <ThumbsUp className="btn-icon" />
              <span>✓ 🤝 Accept Request</span>
            </button>

            <button
              type="button"
              className="reject-btn small flex-center-btn"
              onClick={handleReject}
            >
              <ThumbsDown className="btn-icon" />
              <span>✕ ⛔ Reject</span>
            </button>
          </div>
        )}

        {/* RECYCLER - ACCEPTED STEP */}
        {role === "Recycler" && request.status === "Accepted" && (
          <div className="recycler-actions">
            <button
              type="button"
              className="primary-btn small flex-center-btn pulse-ring-btn"
              onClick={() => updateStatus(request.id, "Received")}
            >
              <CheckCircle2 className="btn-icon" />
              <span>✓ 🚚 Verify & Receive</span>
            </button>

            <button
              type="button"
              className="reject-btn small flex-center-btn"
              onClick={handleReject}
            >
              <X className="btn-icon" />
              <span>✕ Reject</span>
            </button>
          </div>
        )}

        {/* RECYCLER - RECEIVED STEP */}
        {role === "Recycler" && request.status === "Received" && (
          <button
            type="button"
            className="primary-btn small flex-center-btn pulse-ring-btn"
            onClick={() => updateStatus(request.id, "Processing")}
          >
            <RotateCw className="btn-icon spin-slow-hover" />
            <span>⚙️ Start Recycling Process</span>
          </button>
        )}

        {/* RECYCLER - PROCESSING STEP */}
        {role === "Recycler" && request.status === "Processing" && (
          <button
            type="button"
            className="primary-btn small flex-center-btn pulse-ring-btn"
            onClick={() => updateStatus(request.id, "Recycled")}
          >
            <Recycle className="btn-icon spin-slow" />
            <span>♻️ Mark Recycled & Closed</span>
          </button>
        )}

        {/* COMPLETED / REJECTED READONLY BADGES */}
        {role === "Recycler" && request.status === "Recycled" && (
          <span className="badge-completed-pill">
            <CheckCircle2 className="icon-sm" /> ♻️ Completed
          </span>
        )}

        {role === "Recycler" && request.status === "Rejected" && (
          <span className="badge-rejected-pill">
            <Ban className="icon-sm" /> ⛔ Rejected
          </span>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   DEDICATED RECYCLER OPERATIONAL TIMELINE GRAPHIC
   ===================================================== */

function RecyclerOperationalTimeline({ status }) {
  const recyclerMilestones = [
    { key: "Pending", title: "Quote Offer", icon: DollarSign, sub: "Offer Price" },
    { key: "Accepted", title: "Accepted", icon: Handshake, sub: "Agreed" },
    { key: "Received", title: "Received", icon: Factory, sub: "At Plant" },
    { key: "Processing", title: "Recycling Started", icon: RotateCw, sub: "Sorting & Recovery" },
    { key: "Recycled", title: "Material Recovered", icon: Recycle, sub: "Closed" },
  ];

  const getMilestoneState = (key, idx) => {
    if (status === "Rejected") return "disabled";

    const statusMap = {
      Pending: 0,
      Accepted: 1,
      Received: 2,
      Processing: 3,
      Recycled: 4,
    };

    const currentIdx = statusMap[status] ?? 0;
    if (idx < currentIdx) return "completed";
    if (idx === currentIdx) return "active";
    return "upcoming";
  };

  return (
    <div className="recycler-timeline-box">
      <div className="timeline-header-label">
        <Activity className="icon-xs text-purple" />
        <span>Recycler Operational Pipeline Timeline</span>
      </div>

      <div className="recycler-milestones-flow">
        {recyclerMilestones.map((m, idx) => {
          const mState = getMilestoneState(m.key, idx);
          const MIcon = m.icon;

          return (
            <div key={m.key} className={`milestone-step ${mState}`}>
              <div className="milestone-icon-wrapper">
                <MIcon className="milestone-icon" />
              </div>
              <div className="milestone-text">
                <strong className="m-title">{m.title}</strong>
                <small className="m-sub">{m.sub}</small>
              </div>
              {idx < recyclerMilestones.length - 1 && (
                <div className={`milestone-connector ${mState === "completed" ? "completed" : ""}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================
   TRACKING TIMELINE (Desktop Horizontal / Mobile Vertical)
   ===================================================== */

function TrackingTimeline({ status }) {
  const steps = [
    { key: "Collected", stepNo: "1", title: "Collected", subtitle: "📦 Collector", icon: Boxes },
    { key: "Transported", stepNo: "2", title: "Transported", subtitle: "🚚 Logistics", icon: Truck },
    { key: "Received", stepNo: "3", title: "Received", subtitle: "🏭 Recycler", icon: Factory },
    { key: "Processing", stepNo: "4", title: "Processing", subtitle: "⚙️ Plant", icon: Activity },
    { key: "Recycled", stepNo: "5", title: "Recycled", subtitle: "♻️ Completed", icon: Recycle },
  ];

  const getStepStatus = (stepKey, index) => {
    if (status === "Rejected") return "disabled";

    const statusIndexMap = {
      Pending: 0,
      Accepted: 1,
      Received: 2,
      Processing: 3,
      Recycled: 4,
    };

    const currentIdx = statusIndexMap[status] ?? 0;
    if (index < currentIdx) return "completed";
    if (index === currentIdx) return "active";
    return "upcoming";
  };

  return (
    <div className="tracking-timeline-container">
      <div className="tracking-flow flex-tracking">
        {steps.map((step, idx) => {
          const stepState = getStepStatus(step.key, idx);
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="tracking-step-wrapper">
              <div className={`tracking-step ${stepState}`}>
                <div className="tracking-icon-circle">
                  <span className="step-num-badge">{step.stepNo}</span>
                  <StepIcon className="step-icon" />
                </div>
                <strong className="step-title">{step.title}</strong>
                <span className="step-subtitle">{step.subtitle}</span>
              </div>

              {idx < steps.length - 1 && (
                <div className={`tracking-connector ${stepState === "completed" ? "completed" : ""}`}>
                  <div className="connector-line"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================
   EMPTY STATE COMPONENT
   ===================================================== */

function EmptyState({ title, message, actionText, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper glow-pulse">
        <Recycle className="empty-svg-icon spin-slow" />
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      {actionText && onAction && (
        <button className="primary-btn flex-center-btn pulse-ring-btn" onClick={onAction} style={{ marginTop: "18px" }}>
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

export default App;