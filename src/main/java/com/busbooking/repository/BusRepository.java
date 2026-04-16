package com.busbooking.repository;

import com.busbooking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BusRepository extends JpaRepository<Bus, Integer> {
    List<Bus> findBySourceAndDestinationAndDate(String source, String destination, LocalDate date);
}
