const prefix = 'rj-numbers-';
const cacheName = prefix + '2.9';
const entranceArt = ["map-numbers","place-forest","place-space","place-stickers","place-gifts","settings","home","play","back","rotate"].map(name => '/lobby-art/' + name + '.webp');
const files = [
  "audio/en/a1.mp3", "audio/en/a10.mp3", "audio/en/a2.mp3", "audio/en/a3.mp3", "audio/en/a4.mp3", "audio/en/a5.mp3", "audio/en/a6.mp3", "audio/en/a7.mp3",
  "audio/en/a8.mp3", "audio/en/a9.mp3", "audio/en/a_big.mp3", "audio/en/a_look.mp3", "audio/en/a_small.mp3", "audio/en/an_in.mp3", "audio/en/b1.mp3", "audio/en/b2.mp3",
  "audio/en/b2a.mp3", "audio/en/b2b.mp3", "audio/en/b3.mp3", "audio/en/b4.mp3", "audio/en/b5.mp3", "audio/en/b6.mp3", "audio/en/b7.mp3", "audio/en/b8.mp3",
  "audio/en/b_1.mp3", "audio/en/b_again.mp3", "audio/en/b_lie.mp3", "audio/en/b_lied.mp3", "audio/en/b_up.mp3", "audio/en/b_upd.mp3", "audio/en/bd1.mp3", "audio/en/bd_done.mp3",
  "audio/en/bd_put.mp3", "audio/en/bead1.mp3", "audio/en/btn_big.mp3", "audio/en/btn_go.mp3", "audio/en/btn_lying.mp3", "audio/en/btn_next.mp3", "audio/en/btn_ready.mp3", "audio/en/btn_small.mp3",
  "audio/en/btn_upright.mp3", "audio/en/btn_yes.mp3", "audio/en/c0.mp3", "audio/en/c1.mp3", "audio/en/c10.mp3", "audio/en/c10k.mp3", "audio/en/c2.mp3", "audio/en/c2n.mp3",
  "audio/en/c3.mp3", "audio/en/c4.mp3", "audio/en/c5.mp3", "audio/en/c6.mp3", "audio/en/c7.mp3", "audio/en/c8.mp3", "audio/en/c9.mp3", "audio/en/c_big.mp3",
  "audio/en/c_e.mp3", "audio/en/c_j.mp3", "audio/en/c_line_c.mp3", "audio/en/c_line_d.mp3", "audio/en/c_line_s.mp3", "audio/en/c_m.mp3", "audio/en/c_mid.mp3", "audio/en/c_small.mp3",
  "audio/en/c_st.mp3", "audio/en/calm_retry.mp3", "audio/en/cnt1.mp3", "audio/en/cnt2.mp3", "audio/en/cnt3.mp3", "audio/en/cnt4.mp3", "audio/en/cnt5.mp3", "audio/en/cnt6.mp3",
  "audio/en/countdown.mp3", "audio/en/d1.mp3", "audio/en/d2.mp3", "audio/en/d3.mp3", "audio/en/d4.mp3", "audio/en/d_e.mp3", "audio/en/d_j.mp3", "audio/en/d_m.mp3",
  "audio/en/d_same.mp3", "audio/en/demo1.mp3", "audio/en/dg1s.mp3", "audio/en/dg2h.mp3", "audio/en/dg2r.mp3", "audio/en/drag_more.mp3", "audio/en/e1.mp3", "audio/en/e2.mp3",
  "audio/en/e3.mp3", "audio/en/e4.mp3", "audio/en/e5.mp3", "audio/en/e6.mp3", "audio/en/e7.mp3", "audio/en/e_1.mp3", "audio/en/e_2.mp3", "audio/en/e_arrive.mp3",
  "audio/en/e_boat.mp3", "audio/en/e_go.mp3", "audio/en/e_isbig.mp3", "audio/en/e_issmall.mp3", "audio/en/e_tobig.mp3", "audio/en/e_wbig.mp3", "audio/en/e_wsmall.mp3", "audio/en/exit_q.mp3",
  "audio/en/f1.mp3", "audio/en/f2.mp3", "audio/en/f3.mp3", "audio/en/f4.mp3", "audio/en/f5.mp3", "audio/en/f6.mp3", "audio/en/g_cert.mp3", "audio/en/g_fig_raa.mp3",
  "audio/en/g_fig_raijun.mp3", "audio/en/g_key_hatch.mp3", "audio/en/g_ride_boat.mp3", "audio/en/g_ride_cart.mp3", "audio/en/gf_new.mp3", "audio/en/gift.mp3", "audio/en/h_drag.mp3", "audio/en/h_hold.mp3",
  "audio/en/h_rub.mp3", "audio/en/h_tap.mp3", "audio/en/h_trace.mp3", "audio/en/hh1.mp3", "audio/en/hh_ty.mp3", "audio/en/hv1.mp3", "audio/en/hv2.mp3", "audio/en/i1.mp3",
  "audio/en/i2.mp3", "audio/en/i3.mp3", "audio/en/i4.mp3", "audio/en/i5.mp3", "audio/en/i6.mp3", "audio/en/k1.mp3", "audio/en/k2.mp3", "audio/en/k3.mp3",
  "audio/en/k_ci.mp3", "audio/en/k_sq.mp3", "audio/en/k_tr.mp3", "audio/en/left1.mp3", "audio/en/lm1.mp3", "audio/en/lm_no.mp3", "audio/en/lm_ok.mp3", "audio/en/map1.mp3",
  "audio/en/map_go.mp3", "audio/en/menu_hi.mp3", "audio/en/nc1.mp3", "audio/en/nc2.mp3", "audio/en/nc_ok.mp3", "audio/en/num1.mp3", "audio/en/num2.mp3", "audio/en/num3.mp3",
  "audio/en/num6.mp3", "audio/en/p1.mp3", "audio/en/p2.mp3", "audio/en/p3.mp3", "audio/en/p4.mp3", "audio/en/p5.mp3", "audio/en/p6.mp3", "audio/en/p7.mp3",
  "audio/en/p8.mp3", "audio/en/pl_done.mp3", "audio/en/pm_hi.mp3", "audio/en/pop_en1.mp3", "audio/en/pop_en2.mp3", "audio/en/pop_en3.mp3", "audio/en/pop_en6.mp3", "audio/en/puss_ty.mp3",
  "audio/en/rb1.mp3", "audio/en/rb_ty.mp3", "audio/en/rem1.mp3", "audio/en/rem3.mp3", "audio/en/rem4.mp3", "audio/en/restart_q.mp3", "audio/en/rotate.mp3", "audio/en/s1.mp3",
  "audio/en/s2.mp3", "audio/en/s3.mp3", "audio/en/s4.mp3", "audio/en/s5.mp3", "audio/en/sb_open.mp3", "audio/en/sea1.mp3", "audio/en/sh_circle.mp3", "audio/en/sh_square.mp3",
  "audio/en/sh_tri.mp3", "audio/en/share1.mp3", "audio/en/share_hint.mp3", "audio/en/shelf_hi.mp3", "audio/en/shelf_lock.mp3", "audio/en/sn1.mp3", "audio/en/sp0.mp3", "audio/en/sp_end.mp3",
  "audio/en/sq1.mp3", "audio/en/sq_ty.mp3", "audio/en/sticker.mp3", "audio/en/w1.mp3", "audio/en/w2.mp3", "audio/en/w3.mp3", "audio/en/w_done.mp3", "audio/en/wr1.mp3",
  "audio/en/wr2.mp3", "audio/en/z1.mp3", "audio/en/z2.mp3", "audio/en/z2b.mp3", "audio/en/z3.mp3", "audio/es/a1.mp3", "audio/es/a10.mp3", "audio/es/a2.mp3",
  "audio/es/a3.mp3", "audio/es/a4.mp3", "audio/es/a5.mp3", "audio/es/a6.mp3", "audio/es/a7.mp3", "audio/es/a8.mp3", "audio/es/a9.mp3", "audio/es/a_big.mp3",
  "audio/es/a_look.mp3", "audio/es/a_small.mp3", "audio/es/an_in.mp3", "audio/es/b1.mp3", "audio/es/b2.mp3", "audio/es/b2a.mp3", "audio/es/b2b.mp3", "audio/es/b3.mp3",
  "audio/es/b4.mp3", "audio/es/b5.mp3", "audio/es/b6.mp3", "audio/es/b7.mp3", "audio/es/b8.mp3", "audio/es/b_1.mp3", "audio/es/b_again.mp3", "audio/es/b_lie.mp3",
  "audio/es/b_lied.mp3", "audio/es/b_up.mp3", "audio/es/b_upd.mp3", "audio/es/bd1.mp3", "audio/es/bd_done.mp3", "audio/es/bd_put.mp3", "audio/es/bead1.mp3", "audio/es/btn_big.mp3",
  "audio/es/btn_go.mp3", "audio/es/btn_lying.mp3", "audio/es/btn_next.mp3", "audio/es/btn_ready.mp3", "audio/es/btn_small.mp3", "audio/es/btn_upright.mp3", "audio/es/btn_yes.mp3", "audio/es/c0.mp3",
  "audio/es/c1.mp3", "audio/es/c10.mp3", "audio/es/c10k.mp3", "audio/es/c2.mp3", "audio/es/c2n.mp3", "audio/es/c3.mp3", "audio/es/c4.mp3", "audio/es/c5.mp3",
  "audio/es/c6.mp3", "audio/es/c7.mp3", "audio/es/c8.mp3", "audio/es/c9.mp3", "audio/es/c_big.mp3", "audio/es/c_e.mp3", "audio/es/c_j.mp3", "audio/es/c_line_c.mp3",
  "audio/es/c_line_d.mp3", "audio/es/c_line_s.mp3", "audio/es/c_m.mp3", "audio/es/c_mid.mp3", "audio/es/c_small.mp3", "audio/es/c_st.mp3", "audio/es/calm_retry.mp3", "audio/es/cnt1.mp3",
  "audio/es/cnt2.mp3", "audio/es/cnt3.mp3", "audio/es/cnt4.mp3", "audio/es/cnt5.mp3", "audio/es/cnt6.mp3", "audio/es/countdown.mp3", "audio/es/d1.mp3", "audio/es/d2.mp3",
  "audio/es/d3.mp3", "audio/es/d4.mp3", "audio/es/d_e.mp3", "audio/es/d_j.mp3", "audio/es/d_m.mp3", "audio/es/d_same.mp3", "audio/es/demo1.mp3", "audio/es/dg1s.mp3",
  "audio/es/dg2h.mp3", "audio/es/dg2r.mp3", "audio/es/drag_more.mp3", "audio/es/e1.mp3", "audio/es/e2.mp3", "audio/es/e3.mp3", "audio/es/e4.mp3", "audio/es/e5.mp3",
  "audio/es/e6.mp3", "audio/es/e7.mp3", "audio/es/e_1.mp3", "audio/es/e_2.mp3", "audio/es/e_arrive.mp3", "audio/es/e_boat.mp3", "audio/es/e_go.mp3", "audio/es/e_isbig.mp3",
  "audio/es/e_issmall.mp3", "audio/es/e_tobig.mp3", "audio/es/e_wbig.mp3", "audio/es/e_wsmall.mp3", "audio/es/exit_q.mp3", "audio/es/f1.mp3", "audio/es/f2.mp3", "audio/es/f3.mp3",
  "audio/es/f4.mp3", "audio/es/f5.mp3", "audio/es/f6.mp3", "audio/es/g_cert.mp3", "audio/es/g_fig_raa.mp3", "audio/es/g_fig_raijun.mp3", "audio/es/g_key_hatch.mp3", "audio/es/g_ride_boat.mp3",
  "audio/es/g_ride_cart.mp3", "audio/es/gf_new.mp3", "audio/es/gift.mp3", "audio/es/h_drag.mp3", "audio/es/h_hold.mp3", "audio/es/h_rub.mp3", "audio/es/h_tap.mp3", "audio/es/h_trace.mp3",
  "audio/es/hh1.mp3", "audio/es/hh_ty.mp3", "audio/es/hv1.mp3", "audio/es/hv2.mp3", "audio/es/i1.mp3", "audio/es/i2.mp3", "audio/es/i3.mp3", "audio/es/i4.mp3",
  "audio/es/i5.mp3", "audio/es/i6.mp3", "audio/es/k1.mp3", "audio/es/k2.mp3", "audio/es/k3.mp3", "audio/es/k_ci.mp3", "audio/es/k_sq.mp3", "audio/es/k_tr.mp3",
  "audio/es/left1.mp3", "audio/es/lm1.mp3", "audio/es/lm_no.mp3", "audio/es/lm_ok.mp3", "audio/es/map1.mp3", "audio/es/map_go.mp3", "audio/es/menu_hi.mp3", "audio/es/nc1.mp3",
  "audio/es/nc2.mp3", "audio/es/nc_ok.mp3", "audio/es/num1.mp3", "audio/es/num2.mp3", "audio/es/num3.mp3", "audio/es/num6.mp3", "audio/es/p1.mp3", "audio/es/p2.mp3",
  "audio/es/p3.mp3", "audio/es/p4.mp3", "audio/es/p5.mp3", "audio/es/p6.mp3", "audio/es/p7.mp3", "audio/es/p8.mp3", "audio/es/pl_done.mp3", "audio/es/pm_hi.mp3",
  "audio/es/puss_ty.mp3", "audio/es/rb1.mp3", "audio/es/rb_ty.mp3", "audio/es/rem1.mp3", "audio/es/rem3.mp3", "audio/es/rem4.mp3", "audio/es/restart_q.mp3", "audio/es/rotate.mp3",
  "audio/es/s1.mp3", "audio/es/s2.mp3", "audio/es/s3.mp3", "audio/es/s4.mp3", "audio/es/s5.mp3", "audio/es/sb_open.mp3", "audio/es/sea1.mp3", "audio/es/sh_circle.mp3",
  "audio/es/sh_square.mp3", "audio/es/sh_tri.mp3", "audio/es/share1.mp3", "audio/es/share_hint.mp3", "audio/es/shelf_hi.mp3", "audio/es/shelf_lock.mp3", "audio/es/sn1.mp3", "audio/es/sp0.mp3",
  "audio/es/sp_end.mp3", "audio/es/sq1.mp3", "audio/es/sq_ty.mp3", "audio/es/sticker.mp3", "audio/es/w1.mp3", "audio/es/w2.mp3", "audio/es/w3.mp3", "audio/es/w_done.mp3",
  "audio/es/wr1.mp3", "audio/es/wr2.mp3", "audio/es/z1.mp3", "audio/es/z2.mp3", "audio/es/z2b.mp3", "audio/es/z3.mp3", "audio/fr/a1.mp3", "audio/fr/a10.mp3",
  "audio/fr/a2.mp3", "audio/fr/a3.mp3", "audio/fr/a4.mp3", "audio/fr/a5.mp3", "audio/fr/a6.mp3", "audio/fr/a7.mp3", "audio/fr/a8.mp3", "audio/fr/a9.mp3",
  "audio/fr/a_big.mp3", "audio/fr/a_look.mp3", "audio/fr/a_small.mp3", "audio/fr/an_in.mp3", "audio/fr/b1.mp3", "audio/fr/b2.mp3", "audio/fr/b2a.mp3", "audio/fr/b2b.mp3",
  "audio/fr/b3.mp3", "audio/fr/b4.mp3", "audio/fr/b5.mp3", "audio/fr/b6.mp3", "audio/fr/b7.mp3", "audio/fr/b8.mp3", "audio/fr/b_1.mp3", "audio/fr/b_again.mp3",
  "audio/fr/b_lie.mp3", "audio/fr/b_lied.mp3", "audio/fr/b_up.mp3", "audio/fr/b_upd.mp3", "audio/fr/bd1.mp3", "audio/fr/bd_done.mp3", "audio/fr/bd_put.mp3", "audio/fr/bead1.mp3",
  "audio/fr/btn_big.mp3", "audio/fr/btn_go.mp3", "audio/fr/btn_lying.mp3", "audio/fr/btn_next.mp3", "audio/fr/btn_ready.mp3", "audio/fr/btn_small.mp3", "audio/fr/btn_upright.mp3", "audio/fr/btn_yes.mp3",
  "audio/fr/c0.mp3", "audio/fr/c1.mp3", "audio/fr/c10.mp3", "audio/fr/c10k.mp3", "audio/fr/c2.mp3", "audio/fr/c2n.mp3", "audio/fr/c3.mp3", "audio/fr/c4.mp3",
  "audio/fr/c5.mp3", "audio/fr/c6.mp3", "audio/fr/c7.mp3", "audio/fr/c8.mp3", "audio/fr/c9.mp3", "audio/fr/c_big.mp3", "audio/fr/c_e.mp3", "audio/fr/c_j.mp3",
  "audio/fr/c_line_c.mp3", "audio/fr/c_line_d.mp3", "audio/fr/c_line_s.mp3", "audio/fr/c_m.mp3", "audio/fr/c_mid.mp3", "audio/fr/c_small.mp3", "audio/fr/c_st.mp3", "audio/fr/calm_retry.mp3",
  "audio/fr/cnt1.mp3", "audio/fr/cnt2.mp3", "audio/fr/cnt3.mp3", "audio/fr/cnt4.mp3", "audio/fr/cnt5.mp3", "audio/fr/cnt6.mp3", "audio/fr/countdown.mp3", "audio/fr/d1.mp3",
  "audio/fr/d2.mp3", "audio/fr/d3.mp3", "audio/fr/d4.mp3", "audio/fr/d_e.mp3", "audio/fr/d_j.mp3", "audio/fr/d_m.mp3", "audio/fr/d_same.mp3", "audio/fr/demo1.mp3",
  "audio/fr/dg1s.mp3", "audio/fr/dg2h.mp3", "audio/fr/dg2r.mp3", "audio/fr/drag_more.mp3", "audio/fr/e1.mp3", "audio/fr/e2.mp3", "audio/fr/e3.mp3", "audio/fr/e4.mp3",
  "audio/fr/e5.mp3", "audio/fr/e6.mp3", "audio/fr/e7.mp3", "audio/fr/e_1.mp3", "audio/fr/e_2.mp3", "audio/fr/e_arrive.mp3", "audio/fr/e_boat.mp3", "audio/fr/e_go.mp3",
  "audio/fr/e_isbig.mp3", "audio/fr/e_issmall.mp3", "audio/fr/e_tobig.mp3", "audio/fr/e_wbig.mp3", "audio/fr/e_wsmall.mp3", "audio/fr/exit_q.mp3", "audio/fr/f1.mp3", "audio/fr/f2.mp3",
  "audio/fr/f3.mp3", "audio/fr/f4.mp3", "audio/fr/f5.mp3", "audio/fr/f6.mp3", "audio/fr/g_cert.mp3", "audio/fr/g_fig_raa.mp3", "audio/fr/g_fig_raijun.mp3", "audio/fr/g_key_hatch.mp3",
  "audio/fr/g_ride_boat.mp3", "audio/fr/g_ride_cart.mp3", "audio/fr/gf_new.mp3", "audio/fr/gift.mp3", "audio/fr/h_drag.mp3", "audio/fr/h_hold.mp3", "audio/fr/h_rub.mp3", "audio/fr/h_tap.mp3",
  "audio/fr/h_trace.mp3", "audio/fr/hh1.mp3", "audio/fr/hh_ty.mp3", "audio/fr/hv1.mp3", "audio/fr/hv2.mp3", "audio/fr/i1.mp3", "audio/fr/i2.mp3", "audio/fr/i3.mp3",
  "audio/fr/i4.mp3", "audio/fr/i5.mp3", "audio/fr/i6.mp3", "audio/fr/k1.mp3", "audio/fr/k2.mp3", "audio/fr/k3.mp3", "audio/fr/k_ci.mp3", "audio/fr/k_sq.mp3",
  "audio/fr/k_tr.mp3", "audio/fr/left1.mp3", "audio/fr/lm1.mp3", "audio/fr/lm_no.mp3", "audio/fr/lm_ok.mp3", "audio/fr/map1.mp3", "audio/fr/map_go.mp3", "audio/fr/menu_hi.mp3",
  "audio/fr/nc1.mp3", "audio/fr/nc2.mp3", "audio/fr/nc_ok.mp3", "audio/fr/num1.mp3", "audio/fr/num2.mp3", "audio/fr/num3.mp3", "audio/fr/num6.mp3", "audio/fr/p1.mp3",
  "audio/fr/p2.mp3", "audio/fr/p3.mp3", "audio/fr/p4.mp3", "audio/fr/p5.mp3", "audio/fr/p6.mp3", "audio/fr/p7.mp3", "audio/fr/p8.mp3", "audio/fr/pl_done.mp3",
  "audio/fr/pm_hi.mp3", "audio/fr/puss_ty.mp3", "audio/fr/rb1.mp3", "audio/fr/rb_ty.mp3", "audio/fr/rem1.mp3", "audio/fr/rem3.mp3", "audio/fr/rem4.mp3", "audio/fr/restart_q.mp3",
  "audio/fr/rotate.mp3", "audio/fr/s1.mp3", "audio/fr/s2.mp3", "audio/fr/s3.mp3", "audio/fr/s4.mp3", "audio/fr/s5.mp3", "audio/fr/sb_open.mp3", "audio/fr/sea1.mp3",
  "audio/fr/sh_circle.mp3", "audio/fr/sh_square.mp3", "audio/fr/sh_tri.mp3", "audio/fr/share1.mp3", "audio/fr/share_hint.mp3", "audio/fr/shelf_hi.mp3", "audio/fr/shelf_lock.mp3", "audio/fr/sn1.mp3",
  "audio/fr/sp0.mp3", "audio/fr/sp_end.mp3", "audio/fr/sq1.mp3", "audio/fr/sq_ty.mp3", "audio/fr/sticker.mp3", "audio/fr/w1.mp3", "audio/fr/w2.mp3", "audio/fr/w3.mp3",
  "audio/fr/w_done.mp3", "audio/fr/wr1.mp3", "audio/fr/wr2.mp3", "audio/fr/z1.mp3", "audio/fr/z2.mp3", "audio/fr/z2b.mp3", "audio/fr/z3.mp3", "audio/ko/a1.mp3",
  "audio/ko/a10.mp3", "audio/ko/a2.mp3", "audio/ko/a3.mp3", "audio/ko/a4.mp3", "audio/ko/a5.mp3", "audio/ko/a6.mp3", "audio/ko/a7.mp3", "audio/ko/a8.mp3",
  "audio/ko/a9.mp3", "audio/ko/a_big.mp3", "audio/ko/a_look.mp3", "audio/ko/a_small.mp3", "audio/ko/an_in.mp3", "audio/ko/b1.mp3", "audio/ko/b2.mp3", "audio/ko/b2a.mp3",
  "audio/ko/b2b.mp3", "audio/ko/b3.mp3", "audio/ko/b4.mp3", "audio/ko/b5.mp3", "audio/ko/b6.mp3", "audio/ko/b7.mp3", "audio/ko/b8.mp3", "audio/ko/b_1.mp3",
  "audio/ko/b_again.mp3", "audio/ko/b_lie.mp3", "audio/ko/b_lied.mp3", "audio/ko/b_up.mp3", "audio/ko/b_upd.mp3", "audio/ko/bd1.mp3", "audio/ko/bd_done.mp3", "audio/ko/bd_put.mp3",
  "audio/ko/bead1.mp3", "audio/ko/btn_big.mp3", "audio/ko/btn_go.mp3", "audio/ko/btn_lying.mp3", "audio/ko/btn_next.mp3", "audio/ko/btn_ready.mp3", "audio/ko/btn_small.mp3", "audio/ko/btn_upright.mp3",
  "audio/ko/btn_yes.mp3", "audio/ko/c0.mp3", "audio/ko/c1.mp3", "audio/ko/c10.mp3", "audio/ko/c10k.mp3", "audio/ko/c2.mp3", "audio/ko/c2n.mp3", "audio/ko/c3.mp3",
  "audio/ko/c4.mp3", "audio/ko/c5.mp3", "audio/ko/c6.mp3", "audio/ko/c7.mp3", "audio/ko/c8.mp3", "audio/ko/c9.mp3", "audio/ko/c_big.mp3", "audio/ko/c_e.mp3",
  "audio/ko/c_j.mp3", "audio/ko/c_line_c.mp3", "audio/ko/c_line_d.mp3", "audio/ko/c_line_s.mp3", "audio/ko/c_m.mp3", "audio/ko/c_mid.mp3", "audio/ko/c_small.mp3", "audio/ko/c_st.mp3",
  "audio/ko/calm_retry.mp3", "audio/ko/cnt1.mp3", "audio/ko/cnt2.mp3", "audio/ko/cnt3.mp3", "audio/ko/cnt4.mp3", "audio/ko/cnt5.mp3", "audio/ko/cnt6.mp3", "audio/ko/countdown.mp3",
  "audio/ko/d1.mp3", "audio/ko/d2.mp3", "audio/ko/d3.mp3", "audio/ko/d4.mp3", "audio/ko/d_e.mp3", "audio/ko/d_j.mp3", "audio/ko/d_m.mp3", "audio/ko/d_same.mp3",
  "audio/ko/demo1.mp3", "audio/ko/dg1s.mp3", "audio/ko/dg2h.mp3", "audio/ko/dg2r.mp3", "audio/ko/drag_more.mp3", "audio/ko/e1.mp3", "audio/ko/e2.mp3", "audio/ko/e3.mp3",
  "audio/ko/e4.mp3", "audio/ko/e5.mp3", "audio/ko/e6.mp3", "audio/ko/e7.mp3", "audio/ko/e_1.mp3", "audio/ko/e_2.mp3", "audio/ko/e_arrive.mp3", "audio/ko/e_boat.mp3",
  "audio/ko/e_go.mp3", "audio/ko/e_isbig.mp3", "audio/ko/e_issmall.mp3", "audio/ko/e_tobig.mp3", "audio/ko/e_wbig.mp3", "audio/ko/e_wsmall.mp3", "audio/ko/exit_q.mp3", "audio/ko/f1.mp3",
  "audio/ko/f2.mp3", "audio/ko/f3.mp3", "audio/ko/f4.mp3", "audio/ko/f5.mp3", "audio/ko/f6.mp3", "audio/ko/g_cert.mp3", "audio/ko/g_fig_raa.mp3", "audio/ko/g_fig_raijun.mp3",
  "audio/ko/g_key_hatch.mp3", "audio/ko/g_ride_boat.mp3", "audio/ko/g_ride_cart.mp3", "audio/ko/gf_new.mp3", "audio/ko/gift.mp3", "audio/ko/h_drag.mp3", "audio/ko/h_hold.mp3", "audio/ko/h_rub.mp3",
  "audio/ko/h_tap.mp3", "audio/ko/h_trace.mp3", "audio/ko/hh1.mp3", "audio/ko/hh_ty.mp3", "audio/ko/hv1.mp3", "audio/ko/hv2.mp3", "audio/ko/i1.mp3", "audio/ko/i2.mp3",
  "audio/ko/i3.mp3", "audio/ko/i4.mp3", "audio/ko/i5.mp3", "audio/ko/i6.mp3", "audio/ko/k1.mp3", "audio/ko/k2.mp3", "audio/ko/k3.mp3", "audio/ko/k_ci.mp3",
  "audio/ko/k_sq.mp3", "audio/ko/k_tr.mp3", "audio/ko/left1.mp3", "audio/ko/lm1.mp3", "audio/ko/lm_no.mp3", "audio/ko/lm_ok.mp3", "audio/ko/map1.mp3", "audio/ko/map_go.mp3",
  "audio/ko/menu_hi.mp3", "audio/ko/nc1.mp3", "audio/ko/nc2.mp3", "audio/ko/nc_ok.mp3", "audio/ko/num1.mp3", "audio/ko/num2.mp3", "audio/ko/num3.mp3", "audio/ko/num6.mp3",
  "audio/ko/p1.mp3", "audio/ko/p2.mp3", "audio/ko/p3.mp3", "audio/ko/p4.mp3", "audio/ko/p5.mp3", "audio/ko/p6.mp3", "audio/ko/p7.mp3", "audio/ko/p8.mp3",
  "audio/ko/pl_done.mp3", "audio/ko/pm_hi.mp3", "audio/ko/pop_en1.mp3", "audio/ko/pop_en2.mp3", "audio/ko/pop_en3.mp3", "audio/ko/pop_en6.mp3", "audio/ko/puss_ty.mp3", "audio/ko/rb1.mp3",
  "audio/ko/rb_ty.mp3", "audio/ko/rem1.mp3", "audio/ko/rem3.mp3", "audio/ko/rem4.mp3", "audio/ko/restart_q.mp3", "audio/ko/rotate.mp3", "audio/ko/s1.mp3", "audio/ko/s2.mp3",
  "audio/ko/s3.mp3", "audio/ko/s4.mp3", "audio/ko/s5.mp3", "audio/ko/sb_open.mp3", "audio/ko/sea1.mp3", "audio/ko/sh_circle.mp3", "audio/ko/sh_square.mp3", "audio/ko/sh_tri.mp3",
  "audio/ko/share1.mp3", "audio/ko/share_hint.mp3", "audio/ko/shelf_hi.mp3", "audio/ko/shelf_lock.mp3", "audio/ko/sn1.mp3", "audio/ko/sp0.mp3", "audio/ko/sp_end.mp3", "audio/ko/sq1.mp3",
  "audio/ko/sq_ty.mp3", "audio/ko/sticker.mp3", "audio/ko/w1.mp3", "audio/ko/w2.mp3", "audio/ko/w3.mp3", "audio/ko/w_done.mp3", "audio/ko/wr1.mp3", "audio/ko/wr2.mp3",
  "audio/ko/z1.mp3", "audio/ko/z2.mp3", "audio/ko/z2b.mp3", "audio/ko/z3.mp3", "audio/zh/a1.mp3", "audio/zh/a10.mp3", "audio/zh/a2.mp3", "audio/zh/a3.mp3",
  "audio/zh/a4.mp3", "audio/zh/a5.mp3", "audio/zh/a6.mp3", "audio/zh/a7.mp3", "audio/zh/a8.mp3", "audio/zh/a9.mp3", "audio/zh/a_big.mp3", "audio/zh/a_look.mp3",
  "audio/zh/a_small.mp3", "audio/zh/an_in.mp3", "audio/zh/b1.mp3", "audio/zh/b2.mp3", "audio/zh/b2a.mp3", "audio/zh/b2b.mp3", "audio/zh/b3.mp3", "audio/zh/b4.mp3",
  "audio/zh/b5.mp3", "audio/zh/b6.mp3", "audio/zh/b7.mp3", "audio/zh/b8.mp3", "audio/zh/b_1.mp3", "audio/zh/b_again.mp3", "audio/zh/b_lie.mp3", "audio/zh/b_lied.mp3",
  "audio/zh/b_up.mp3", "audio/zh/b_upd.mp3", "audio/zh/bd1.mp3", "audio/zh/bd_done.mp3", "audio/zh/bd_put.mp3", "audio/zh/bead1.mp3", "audio/zh/btn_big.mp3", "audio/zh/btn_go.mp3",
  "audio/zh/btn_lying.mp3", "audio/zh/btn_next.mp3", "audio/zh/btn_ready.mp3", "audio/zh/btn_small.mp3", "audio/zh/btn_upright.mp3", "audio/zh/btn_yes.mp3", "audio/zh/c0.mp3", "audio/zh/c1.mp3",
  "audio/zh/c10.mp3", "audio/zh/c10k.mp3", "audio/zh/c2.mp3", "audio/zh/c2n.mp3", "audio/zh/c3.mp3", "audio/zh/c4.mp3", "audio/zh/c5.mp3", "audio/zh/c6.mp3",
  "audio/zh/c7.mp3", "audio/zh/c8.mp3", "audio/zh/c9.mp3", "audio/zh/c_big.mp3", "audio/zh/c_e.mp3", "audio/zh/c_j.mp3", "audio/zh/c_line_c.mp3", "audio/zh/c_line_d.mp3",
  "audio/zh/c_line_s.mp3", "audio/zh/c_m.mp3", "audio/zh/c_mid.mp3", "audio/zh/c_small.mp3", "audio/zh/c_st.mp3", "audio/zh/calm_retry.mp3", "audio/zh/cnt1.mp3", "audio/zh/cnt2.mp3",
  "audio/zh/cnt3.mp3", "audio/zh/cnt4.mp3", "audio/zh/cnt5.mp3", "audio/zh/cnt6.mp3", "audio/zh/countdown.mp3", "audio/zh/d1.mp3", "audio/zh/d2.mp3", "audio/zh/d3.mp3",
  "audio/zh/d4.mp3", "audio/zh/d_e.mp3", "audio/zh/d_j.mp3", "audio/zh/d_m.mp3", "audio/zh/d_same.mp3", "audio/zh/demo1.mp3", "audio/zh/dg1s.mp3", "audio/zh/dg2h.mp3",
  "audio/zh/dg2r.mp3", "audio/zh/drag_more.mp3", "audio/zh/e1.mp3", "audio/zh/e2.mp3", "audio/zh/e3.mp3", "audio/zh/e4.mp3", "audio/zh/e5.mp3", "audio/zh/e6.mp3",
  "audio/zh/e7.mp3", "audio/zh/e_1.mp3", "audio/zh/e_2.mp3", "audio/zh/e_arrive.mp3", "audio/zh/e_boat.mp3", "audio/zh/e_go.mp3", "audio/zh/e_isbig.mp3", "audio/zh/e_issmall.mp3",
  "audio/zh/e_tobig.mp3", "audio/zh/e_wbig.mp3", "audio/zh/e_wsmall.mp3", "audio/zh/exit_q.mp3", "audio/zh/f1.mp3", "audio/zh/f2.mp3", "audio/zh/f3.mp3", "audio/zh/f4.mp3",
  "audio/zh/f5.mp3", "audio/zh/f6.mp3", "audio/zh/g_cert.mp3", "audio/zh/g_fig_raa.mp3", "audio/zh/g_fig_raijun.mp3", "audio/zh/g_key_hatch.mp3", "audio/zh/g_ride_boat.mp3", "audio/zh/g_ride_cart.mp3",
  "audio/zh/gf_new.mp3", "audio/zh/gift.mp3", "audio/zh/h_drag.mp3", "audio/zh/h_hold.mp3", "audio/zh/h_rub.mp3", "audio/zh/h_tap.mp3", "audio/zh/h_trace.mp3", "audio/zh/hh1.mp3",
  "audio/zh/hh_ty.mp3", "audio/zh/hv1.mp3", "audio/zh/hv2.mp3", "audio/zh/i1.mp3", "audio/zh/i2.mp3", "audio/zh/i3.mp3", "audio/zh/i4.mp3", "audio/zh/i5.mp3",
  "audio/zh/i6.mp3", "audio/zh/k1.mp3", "audio/zh/k2.mp3", "audio/zh/k3.mp3", "audio/zh/k_ci.mp3", "audio/zh/k_sq.mp3", "audio/zh/k_tr.mp3", "audio/zh/left1.mp3",
  "audio/zh/lm1.mp3", "audio/zh/lm_no.mp3", "audio/zh/lm_ok.mp3", "audio/zh/map1.mp3", "audio/zh/map_go.mp3", "audio/zh/menu_hi.mp3", "audio/zh/nc1.mp3", "audio/zh/nc2.mp3",
  "audio/zh/nc_ok.mp3", "audio/zh/num1.mp3", "audio/zh/num2.mp3", "audio/zh/num3.mp3", "audio/zh/num6.mp3", "audio/zh/p1.mp3", "audio/zh/p2.mp3", "audio/zh/p3.mp3",
  "audio/zh/p4.mp3", "audio/zh/p5.mp3", "audio/zh/p6.mp3", "audio/zh/p7.mp3", "audio/zh/p8.mp3", "audio/zh/pl_done.mp3", "audio/zh/pm_hi.mp3", "audio/zh/puss_ty.mp3",
  "audio/zh/rb1.mp3", "audio/zh/rb_ty.mp3", "audio/zh/rem1.mp3", "audio/zh/rem3.mp3", "audio/zh/rem4.mp3", "audio/zh/restart_q.mp3", "audio/zh/rotate.mp3", "audio/zh/s1.mp3",
  "audio/zh/s2.mp3", "audio/zh/s3.mp3", "audio/zh/s4.mp3", "audio/zh/s5.mp3", "audio/zh/sb_open.mp3", "audio/zh/sea1.mp3", "audio/zh/sh_circle.mp3", "audio/zh/sh_square.mp3",
  "audio/zh/sh_tri.mp3", "audio/zh/share1.mp3", "audio/zh/share_hint.mp3", "audio/zh/shelf_hi.mp3", "audio/zh/shelf_lock.mp3", "audio/zh/sn1.mp3", "audio/zh/sp0.mp3", "audio/zh/sp_end.mp3",
  "audio/zh/sq1.mp3", "audio/zh/sq_ty.mp3", "audio/zh/sticker.mp3", "audio/zh/w1.mp3", "audio/zh/w2.mp3", "audio/zh/w3.mp3", "audio/zh/w_done.mp3", "audio/zh/wr1.mp3",
  "audio/zh/wr2.mp3", "audio/zh/z1.mp3", "audio/zh/z2.mp3", "audio/zh/z2b.mp3", "audio/zh/z3.mp3", "core.js", "ep1.js", "img/bg_candy.webp",
  "img/bg_forest.webp", "img/bg_river.webp", "img/bg_sea.webp", "img/bg_space.webp", "img/eodumi.webp", "img/hedgehog.webp", "img/icon-192.png", "img/icon-512.png",
  "img/mari.webp", "img/mari2.webp", "img/mari3.webp", "img/puss.webp", "img/raa.webp", "img/rabbit.webp", "img/raijun.webp", "img/squirrel.webp",
  "index.html", "lines.js", "main.js", "play.js", "space.js", "style.css", "manifest.webmanifest",
  'version.json', '/shared.js', '/game-nav.css', ...entranceArt,
];

const scope = new URL(self.registration.scope);
const sharedFiles = new Set(['/shared.js', '/game-nav.css', ...entranceArt]);
const entry = new URL('index.html', scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    for (let index = 0; index < files.length; index += 24) {
      const batch = files.slice(index, index + 24).map(file => new Request(new URL(file, scope), {cache: 'reload'}));
      await cache.addAll(batch);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(prefix) && name !== cacheName).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

function ranged(response, range) {
  if (!range) return response;
  return (async () => {
    const data = await response.arrayBuffer();
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      return new Response(null, {status: 416, headers: {'Content-Range': 'bytes */' + data.byteLength}});
    }
    const start = match[1] ? Number(match[1]) : Math.max(0, data.byteLength - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), data.byteLength - 1) : data.byteLength - 1;
    if (start > end) return new Response(null, {status: 416, headers: {'Content-Range': 'bytes */' + data.byteLength}});
    return new Response(data.slice(start, end + 1), {
      status: 206,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Range': 'bytes ' + start + '-' + end + '/' + data.byteLength,
        'Content-Length': end - start + 1,
        'Accept-Ranges': 'bytes',
      },
    });
  })();
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin) return;
  const shared = sharedFiles.has(url.pathname);
  if (!shared && !url.pathname.startsWith(scope.pathname)) return;
  const navigation = request.mode === 'navigate';
  if (navigation && url.pathname !== scope.pathname && url.href.split('?')[0] !== entry) return;
  const key = navigation ? entry : url.origin + url.pathname;
  const networkFirst = navigation || /\.(js|css|json|webmanifest)$/.test(url.pathname);
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    if (!networkFirst) {
      const saved = await cache.match(key);
      if (saved) return ranged(saved, request.headers.get('range'));
    }
    try {
      const live = await fetch(request, {cache: networkFirst ? 'no-store' : 'default'});
      if (live.ok && live.status === 200) await cache.put(key, live.clone()).catch(() => {});
      return live;
    } catch {
      return await cache.match(key) || new Response('오프라인에서 파일을 열 수 없어요.', {status: 503});
    }
  })());
});
