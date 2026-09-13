export default {
  async redirects() {
    return [
      { source: "/entry.html", destination: "/entry", permanent: true },
      { source: "/admin/index.html", destination: "/admin", permanent: true },
    ];
  },
};
